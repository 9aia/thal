import { and, eq, isNull } from 'drizzle-orm'
import { getCharacterCategoryId } from '~/server/services/character'
import { type CharacterDraftResponseSchema, getCharacterDraftPrompt } from '~/utils/character'
import { promptGeminiJson } from '~/utils/gemini'
import { getValidated } from '~/utils/h3'
import { badRequest, internal, paymentRequired, rateLimit, unauthorized } from '~/utils/nuxt'
import { isPlanPastDue } from '~/utils/plan'
import type { CharacterDraftData } from '~~/db/schema'
import { characterDraftLocalizations, characterDraftSchema, characterDrafts } from '~~/db/schema'

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

  const data = await getValidated(event, 'body', characterDraftSchema)
  const { prompt, locale } = data

  const [existingDraft] = await orm.select().from(characterDrafts).where(
    and(eq(characterDrafts.creatorId, user.id), isNull(characterDrafts.characterId)),
  )

  if (existingDraft)
    throw badRequest('You already have a pending character draft')

  const generateCharacterRateLimit = await event.context.cloudflare.env.GENERATE_CHARACTER_RATE_LIMIT.limit({ key: `generate-character-${user.id}` })

  if (!generateCharacterRateLimit.success)
    throw rateLimit()

  const { responseSchema, guidelines, createIntro, createOutro } = getCharacterDraftPrompt()
  const systemInstruction = `
    ${createIntro}

    ${guidelines}

    ${createOutro}
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

  const [newCharacter] = await orm
    .insert(characterDrafts)
    .values({
      data: draftData,
      prompt,
      creatorId: user.id,
    })
    .returning()

  await orm.batch([
    orm.insert(characterDraftLocalizations).values({
      name: geminiData.localizations['pt-BR'].name,
      description: geminiData.localizations['pt-BR'].description,
      instructions: geminiData.localizations['pt-BR'].instructions,
      locale: 'pt-BR',
      characterDraftId: newCharacter.id,
    }),
    orm.insert(characterDraftLocalizations).values({
      name: geminiData.localizations['en-US'].name,
      description: geminiData.localizations['en-US'].description,
      instructions: geminiData.localizations['en-US'].instructions,
      locale: 'en-US',
      characterDraftId: newCharacter.id,
    }),
  ])

  const dto:
    typeof newCharacter & {
      data: typeof newCharacter.data & {
        name: string
        description: string
        instructions: string
      }
    } & {
      username: string
    } = { ...newCharacter } as any
  const localization = geminiData.localizations[locale]

  dto.data.name = localization.name
  dto.data.description = localization.description
  dto.data.instructions = localization.instructions
  dto.username = geminiData.username

  return dto
})
