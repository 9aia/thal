import { and, eq, isNull } from 'drizzle-orm'
import { getCharacterCategoryId } from '~/server/services/character'
import { type CharacterDraftResponseSchema, getCharacterDraftPrompt } from '~/utils/character'
import { now } from '~/utils/date'
import { promptGeminiJson } from '~/utils/gemini'
import { getValidated } from '~/utils/h3'
import { badRequest, internal, paymentRequired, unauthorized } from '~/utils/nuxt'
import { isPlanPastDue } from '~/utils/plan'
import type { CharacterDraftData } from '~~/db/schema'
import { characterDraftSchema, characterDrafts } from '~~/db/schema'

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
  const { prompt } = data

  const [existingDraft] = await orm.select().from(characterDrafts).where(
    and(eq(characterDrafts.creatorId, user.id), isNull(characterDrafts.characterId)),
  )

  if (existingDraft)
    throw badRequest('You already have a pending character draft')

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
    description: geminiData.description,
    instructions: geminiData.instructions,
    name: geminiData.name,
    categoryId,
    creatorId: user.id,
  }

  const [newCharacter] = await orm
    .insert(characterDrafts)
    .values({
      data: draftData,
      prompt,
      creatorId: user.id,
      createdAt: now().toString(),
    })
    .returning()

  return {
    ...newCharacter,
    username: geminiData.username,
  }
})
