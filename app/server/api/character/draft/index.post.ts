import { and, eq, isNull } from 'drizzle-orm'
import { getCharacterCategoryId } from '~/server/services/character'
import { characterDraftResponseSchema, getCharacterDraftPrompt } from '~/utils/character'
import { promptGeminiJson } from '~/utils/gemini'
import { getValidated } from '~/utils/h3'
import { badRequest, internal, paymentRequired, rateLimit, unauthorized } from '~/utils/nuxt'
import { canUseAIFeatures } from '~/utils/plan'
import type { CharacterDraftData } from '~~/db/schema'
import { characterDraftLocalizations, characterDraftSchema, characterDrafts } from '~~/db/schema'

export default eventHandler(async (event) => {
  const { GCP_GEMINI_API_KEY, GEMINI_MODEL } = useRuntimeConfig(event)

  if (!GCP_GEMINI_API_KEY)
    throw internal('GCP_GEMINI_API_KEY is not set in the environment')

  if (!GEMINI_MODEL)
    throw internal('GEMINI_MODEL is not set in the environment')

  const data = await getValidated(event, 'body', characterDraftSchema)
  const { prompt, locale } = data

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  if (!canUseAIFeatures(user))
    throw paymentRequired()

  const [existingDraft] = await orm.select().from(characterDrafts).where(
    and(
      eq(characterDrafts.creatorId, user.id),
      isNull(characterDrafts.characterId),
      isNull(characterDrafts.deletedAt),
    ),
  )

  if (existingDraft)
    throw badRequest('You already have a pending character draft')

  const generateCharacterRateLimit = await event.context.cloudflare.env.GENERATE_CHARACTER_RATE_LIMIT.limit({ key: `generate-character-${user.id}` })

  if (!generateCharacterRateLimit.success)
    throw rateLimit()

  const { responseSchema, guidelines, createIntro, createOutro, createInstructions } = getCharacterDraftPrompt()
  const systemInstruction = `
    ${createIntro}

    ${createInstructions}

    ${guidelines}

    ${createOutro}
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
