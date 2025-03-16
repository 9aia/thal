import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { getCharacterCategoryId, getCharacterCategoryName } from '~/server/services/character'
import type { CharacterDraftResponseSchema } from '~/utils/character'
import { getCharacterDraftPrompt } from '~/utils/character'
import { now } from '~/utils/date'
import { promptGeminiJson } from '~/utils/gemini'
import { getValidated } from '~/utils/h3'
import { badRequest, forbidden, internal, notFound, paymentRequired, unauthorized } from '~/utils/nuxt'
import { isPlanPastDue } from '~/utils/plan'
import type { CharacterDraftData } from '~~/db/schema'
import { characterDraftSchema, characterDrafts, characterUsernames, usernameSchema } from '~~/db/schema'

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
  const data = await getValidated(event, 'body', characterDraftSchema)

  const characterUsername = await orm.query.characterUsernames.findFirst({
    where: eq(characterUsernames.username, username),
    with: {
      character: true,
    },
  })

  if (!characterUsername)
    throw notFound('Character not found')

  if (characterUsername?.character?.creatorId !== user.id)
    throw forbidden()

  const [existingDraft] = await orm.select().from(characterDrafts).where(
    and(
      eq(characterDrafts.creatorId, user.id),
      eq(characterDrafts.characterId, characterUsername.characterId!),
    ),
  )

  if (!existingDraft)
    throw badRequest(`No editing draft found for characterId ${characterUsername.characterId}`)

  const { responseSchema, guidelines, editIntro, editOutro } = getCharacterDraftPrompt()

  const systemInstruction = `
    ${editIntro}

    ${guidelines}

    ${editOutro}
  `

  const category = getCharacterCategoryName(characterUsername.character.categoryId)
  const prompt = `
      <previous-prompt>
        ${existingDraft.prompt}
      </previous-prompt>

      <previous-character-data>
        ${JSON.stringify({
          name: existingDraft.data.name,
          username: existingDraft.data.username,
          description: existingDraft.data.description,
          instructions: existingDraft.data.instructions,
          category,
        })}
      </previous-character-data>

      <separator></separator>

      <new-prompt>
        ${data.prompt}
      </new-prompt>
    `

  const geminiResponseData = await promptGeminiJson<CharacterDraftResponseSchema>({
    apiKey: GEMINI_API_KEY,
    model: GEMINI_MODEL,
    prompt,
    responseSchema,
    systemInstruction,
  })

  console.log({
    prompt,
    systemInstruction,
  })
  const categoryId = getCharacterCategoryId(geminiResponseData.category)

  const draftData: CharacterDraftData = {
    username: geminiResponseData.username,
    description: geminiResponseData.description,
    instructions: geminiResponseData.instructions,
    name: geminiResponseData.name,
    categoryId,
    creatorId: user.id,
  }

  const [newCharacter] = await orm
    .update(characterDrafts)
    .set({
      data: draftData,
      prompt: data.prompt,
      creatorId: user.id,
      createdAt: now().toString(),
    })
    .where(eq(characterDrafts.id, existingDraft.id))
    .returning()

  return {
    ...newCharacter,
    username: geminiResponseData.username,
  }
})
