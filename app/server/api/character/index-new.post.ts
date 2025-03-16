import { type ResponseSchema, SchemaType } from '@google/generative-ai'
import { eq } from 'drizzle-orm'
import { categorizeCharacter } from '~/server/services/character'
import { now } from '~/utils/date'
import { promptGeminiJson } from '~/utils/gemini'
import { getValidated } from '~/utils/h3'
import { badRequest, paymentRequired, unauthorized } from '~/utils/nuxt'
import { isPlanPastDue } from '~/utils/plan'
import { characterPromptSchema, characterUsernames, characters } from '~~/db/schema'

export default eventHandler(async (event) => {
  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  if (isPlanPastDue(user)) {
    throw paymentRequired()
  }

  const { GEMINI_MODEL, GEMINI_API_KEY } = useRuntimeConfig()

  const data = await getValidated(event, 'body', characterPromptSchema)

  const { prompt, discoverable } = data

  const responseSchema: ResponseSchema = {
    type: SchemaType.OBJECT,
    properties: {
      name: {
        type: SchemaType.STRING,
        description: 'Character name. Min 1 character, max 20 characters.',
        example: 'Morty Smith',
      },
      description: {
        type: SchemaType.STRING,
        description: 'Line description of the character. Min 1 character, max 100 characters.',
        example: 'Awkward, anxious teen. Travels dimensions with his eccentric grandpa Rick.',
      },
      instructions: {
        type: SchemaType.STRING,
        description: 'Instructions for the character. Use bullet list. Min 1 character, max 500 characters.',
        example: `
          * Nervous, easily flustered, often overwhelmed.
          * Wants to please Rick but often fails.
          * Has moments of bravery and stands up for himself.
          * Deep down, kind and compassionate.
          * Stutters and rambles when anxious.
          * Often the voice of reason (even if ignored).
          * Insecure and unsure of himself.
          * Prone to existential dread.
          * Occasionally shows surprising cleverness.
        `,
      },
      username: {
        type: SchemaType.STRING,
        description: 'Unique username for the character. Min 1 character, max 20 characters. Username can only contain letters, numbers, and underscores.',
        example: 'morty',
      },

    },
    required: ['name', 'instructions', 'username', 'description'],
  }

  const systemInstruction = `
    You are an excelent character creator. You are expected to create a character based on the following prompt and follow the guidelines.
    
    You must create a safe character.
  `

  interface ResponseSchemaData {
    name: string
    instructions: string
    username: string
    description: string
  }

  const geminiResponseData = await promptGeminiJson<ResponseSchemaData>({
    apiKey: GEMINI_API_KEY,
    model: GEMINI_MODEL,
    prompt,
    responseSchema,
    systemInstruction,
  })

  const [existingCharacterUsername] = await orm
    .select()
    .from(characterUsernames)
    .where(eq(characterUsernames.username, geminiResponseData.username))

  if (existingCharacterUsername && existingCharacterUsername.characterId !== null)
    throw badRequest('Username already taken')

  const categoryId = await categorizeCharacter(event, data)

  const [newCharacter] = await orm
    .insert(characters)
    .values({
      description: geminiResponseData.description,
      instructions: geminiResponseData.instructions,
      name: geminiResponseData.name,
      conversationStarters: '[]',
      prompt,
      discoverable,
      creatorId: user.id,
      createdAt: now().toString(),
      categoryId,
    })
    .returning()

  const isNewCharacterUsername = existingCharacterUsername === undefined

  if (isNewCharacterUsername) {
    await orm.insert(characterUsernames).values({
      username: geminiResponseData.username,
      characterId: newCharacter.id,
    })
  }
  else {
    await orm
      .update(characterUsernames)
      .set({
        characterId: newCharacter.id,
      })
      .where(eq(characterUsernames.username, geminiResponseData.username))
  }

  return {
    ...newCharacter,
    username: geminiResponseData.username,
  }
})
