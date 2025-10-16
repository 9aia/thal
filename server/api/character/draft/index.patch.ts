import { and, eq, isNull } from 'drizzle-orm'
import { z } from 'zod'
import { getCharacterCategoryId, getCharacterCategoryName } from '~~/server/services/character'
import { characterDraftResponseSchema, getCharacterDraftPrompt } from '~~/server/utils/character'
import { now } from '#shared/utils/date'
import { promptGeminiJson } from '~~/server/utils/gemini'
import { getValidated } from '~~/server/utils/h3'
import { badRequest, internal, paymentRequired, rateLimit, unauthorized } from '~~/server/utils/nuxt'
import { canUseAIFeatures } from '#shared/utils/plan'
import type { CharacterDraftData } from '~~/server/db/schema'
import { characterDraftLocalizations, characterDraftSchema, characterDrafts, characters, usernames } from '~~/server/db/schema'

export default eventHandler(async (event) => {
  const { GCP_GEMINI_API_KEY, GEMINI_MODEL } = useRuntimeConfig(event)

  if (!GCP_GEMINI_API_KEY)
    throw internal('GCP_GEMINI_API_KEY is not set in the environment')

  if (!GEMINI_MODEL)
    throw internal('GEMINI_MODEL is not set in the environment')

  const { locale, characterId: characterIdParam, characterUsername, ...data } = await getValidated(event, 'body', characterDraftSchema.extend({
    characterId: z.number().optional(),
    characterUsername: z.string().optional(),
  }))

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  if (!canUseAIFeatures(user))
    throw paymentRequired()

  let characterId: number | null = characterIdParam ?? null

  if (!characterId && characterUsername) {
    const result = await orm.select().from(characters)
      .leftJoin(usernames, eq(characters.id, usernames.characterId))
      .where(and(isNull(characters.deletedAt), eq(usernames.text, characterUsername)))
      .get()

    if (!result?.Character?.id) {
      throw badRequest(`Character with username \`${characterUsername}\` not found`)
    }

    characterId = result.Character.id
  }

  const existingDraft = await orm.query.characterDrafts.findFirst({
    where: and(
      eq(characterDrafts.creatorId, user.id),
      characterId
        ? eq(characterDrafts.characterId, characterId)
        : isNull(characterDrafts.characterId),
      isNull(characterDrafts.deletedAt),
    ),
    with: {
      characterDraftLocalizations: {
        where: and(
          eq(characterDraftLocalizations.locale, 'en-US'),
          isNull(characterDraftLocalizations.deletedAt),
        ),
      },
      character: !characterId
        ? undefined
        : {
            columns: {
              categoryId: true,
            },
          },
    },
  })

  if (!existingDraft)
    throw badRequest(characterId ? `You do not have a pending character draft for \`characterId\` ${characterId}` : 'You do not have a pending character draft')

  const generateCharacterRateLimit = await event.context.cloudflare.env.GENERATE_CHARACTER_RATE_LIMIT.limit({ key: `generate-character-${user.id}` })

  if (!generateCharacterRateLimit.success)
    throw rateLimit()

  const { responseSchema, guidelines, editIntro, editOutro, editInstructions } = getCharacterDraftPrompt()
  const systemInstruction = `
    ${editIntro}

    ${editInstructions}

    ${guidelines}

    ${editOutro}
  `

  const promptLocalization = existingDraft.characterDraftLocalizations[0]!

  const prompt = !characterId
    ? data.prompt
    : `
    <previous-prompt>
      ${existingDraft.prompt}
    </previous-prompt>

    <previous-character-data>
      ${JSON.stringify({
        username: existingDraft.data.username,
        name: promptLocalization.name,
        description: promptLocalization.description,
        instructions: promptLocalization.instructions,
        category: getCharacterCategoryName(existingDraft.character!.categoryId!),
      }, null, 2)}
    </previous-character-data>

    <separator></separator>

    <new-prompt>
      ${data.prompt}
    </new-prompt>
  `

  const rawGeminiData = await promptGeminiJson({
    apiKey: GCP_GEMINI_API_KEY,
    model: GEMINI_MODEL,
    prompt,
    responseSchema,
    systemInstruction,
  })

  const geminiDataValidation = characterDraftResponseSchema.safeParse(rawGeminiData)
  if (!geminiDataValidation.success) {
    throw internal(`Generated data is invalid: ${JSON.stringify(geminiDataValidation.error.errors)}`)
  }

  const geminiData = geminiDataValidation.data
  const categoryId = getCharacterCategoryId(geminiData.category)

  const draftData: CharacterDraftData = {
    username: geminiData.username,
    categoryId,
  }

  const result = await orm.batch([
    orm.update(characterDrafts)
      .set({
        id: existingDraft.id,
        data: draftData,
        prompt: data.prompt,
        creatorId: user.id,
        updatedAt: now(),
      })
      .where(eq(characterDrafts.id, existingDraft.id))
      .returning(),
    orm.update(characterDraftLocalizations).set({
      name: geminiData.localizations['pt-BR'].name,
      description: geminiData.localizations['pt-BR'].description,
      instructions: geminiData.localizations['pt-BR'].instructions,
      locale: 'pt-BR',
      characterDraftId: existingDraft.id,
      updatedAt: now(),
    }).where(and(eq(characterDraftLocalizations.locale, 'pt-BR'), eq(characterDraftLocalizations.characterDraftId, existingDraft.id))),
    orm.update(characterDraftLocalizations).set({
      name: geminiData.localizations['en-US'].name,
      description: geminiData.localizations['en-US'].description,
      instructions: geminiData.localizations['en-US'].instructions,
      locale: 'en-US',
      characterDraftId: existingDraft.id,
      updatedAt: now(),
    }).where(and(eq(characterDraftLocalizations.locale, 'en-US'), eq(characterDraftLocalizations.characterDraftId, existingDraft.id))),
  ])

  const updatedDraft = result[0][0]
  if (!updatedDraft)
    throw internal('Failed to update draft')

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
  const localization = geminiData.localizations[locale!]

  dto.data.name = localization.name
  dto.data.description = localization.description
  dto.data.instructions = localization.instructions
  dto.username = geminiData.username

  return dto
})
