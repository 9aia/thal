import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { getCharacterCategoryId, getCharacterCategoryName } from '~/server/services/character'
import type { CharacterDraftResponseSchema } from '~/utils/character'
import { getCharacterDraftPrompt } from '~/utils/character'
import { now } from '~/utils/date'
import { promptGeminiJson } from '~/utils/gemini'
import { getValidated } from '~/utils/h3'
import { badRequest, forbidden, internal, notFound, paymentRequired, rateLimit, unauthorized } from '~/utils/nuxt'
import { isPlanPastDue } from '~/utils/plan'
import type { CharacterDraftData } from '~~/db/schema'
import { characterDraftLocalizations, characterDraftSchema, characterDrafts, usernameSchema, usernames } from '~~/db/schema'

export default eventHandler(async (event) => {
  const { GEMINI_MODEL, GEMINI_API_KEY } = useRuntimeConfig(event)

  if (!GEMINI_API_KEY)
    throw internal('GEMINI_API_KEY is not set in the environment')

  if (!GEMINI_MODEL)
    throw internal('GEMINI_MODEL is not set in the environment')

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  if (isPlanPastDue(user))
    throw paymentRequired()

  const { username } = await getValidated(event, 'params', z.object({ username: usernameSchema }))
  const { locale, ...data } = await getValidated(event, 'body', characterDraftSchema)

  const usernameQuery = await orm.query.usernames.findFirst({
    where: eq(usernames.username, username),
    with: {
      character: true,
    },
  })

  if (!usernameQuery)
    throw notFound('Character not found')

  if (usernameQuery?.character?.creatorId !== user.id)
    throw forbidden()

  const existingDraft = await orm.query.characterDrafts.findFirst({
    where: and(
      eq(characterDrafts.creatorId, user.id),
      eq(characterDrafts.characterId, usernameQuery.characterId!),
    ),
    with: {
      characterDraftLocalizations: {
        where: eq(characterDraftLocalizations.locale, 'en-US'),
      },
    },
  })

  if (!existingDraft)
    throw badRequest(`No editing draft found for characterId ${usernameQuery.characterId}`)

  const generateCharacterRateLimit = await event.context.cloudflare.env.GENERATE_CHARACTER_RATE_LIMIT.limit({ key: `generate-character-${user.id}` })

  if (!generateCharacterRateLimit.success)
    throw rateLimit()

  const { responseSchema, guidelines, editIntro, editOutro } = getCharacterDraftPrompt()

  const systemInstruction = `
    ${editIntro}

    ${guidelines}

    ${editOutro}
  `

  const category = getCharacterCategoryName(usernameQuery.character.categoryId)

  const promptLocalization = existingDraft.characterDraftLocalizations[0]

  const prompt = `
      <previous-prompt>
        ${existingDraft.prompt}
      </previous-prompt>

      <previous-character-data>
        ${JSON.stringify({
          username: existingDraft.data.username,
          name: promptLocalization.name,
          description: promptLocalization.description,
          instructions: promptLocalization.instructions,
          category,
        }, null, 2)}
      </previous-character-data>

      <separator></separator>

      <new-prompt>
        ${data.prompt}
      </new-prompt>
    `

  const geminiData = await promptGeminiJson<CharacterDraftResponseSchema>({
    apiKey: GEMINI_API_KEY,
    model: GEMINI_MODEL,
    prompt,
    responseSchema,
    systemInstruction,
  })
  const categoryId = getCharacterCategoryId(geminiData.category)

  const draftData: CharacterDraftData = {
    username: geminiData.username,
    categoryId,
    creatorId: user.id,
  }

  const result = await orm.batch([
    orm.update(characterDrafts)
      .set({
        id: existingDraft.id,
        data: draftData,
        prompt: data.prompt,
        creatorId: user.id,
        createdAt: now().toString(),
      })
      .where(eq(characterDrafts.id, existingDraft.id))
      .returning(),
    orm.update(characterDraftLocalizations).set({
      name: geminiData.localizations['pt-BR'].name,
      description: geminiData.localizations['pt-BR'].description,
      instructions: geminiData.localizations['pt-BR'].instructions,
      locale: 'pt-BR',
      characterDraftId: existingDraft.id,
    }).where(and(eq(characterDraftLocalizations.locale, 'pt-BR'), eq(characterDraftLocalizations.characterDraftId, existingDraft.id))),
    orm.update(characterDraftLocalizations).set({
      name: geminiData.localizations['en-US'].name,
      description: geminiData.localizations['en-US'].description,
      instructions: geminiData.localizations['en-US'].instructions,
      locale: 'en-US',
      characterDraftId: existingDraft.id,
    }).where(and(eq(characterDraftLocalizations.locale, 'en-US'), eq(characterDraftLocalizations.characterDraftId, existingDraft.id))),
  ])

  const updatedDraft = result[0][0]

  const dto:
    typeof updatedDraft & {
      data: typeof updatedDraft.data & {
        name: string
        description: string
        instructions: string
      }
    } & {
      username: string
    } = { ...updatedDraft } as any
  const localization = geminiData.localizations[locale]

  dto.data.name = localization.name
  dto.data.description = localization.description
  dto.data.instructions = localization.instructions
  dto.username = geminiData.username

  return dto
})
