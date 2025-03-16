import type { ResponseSchema } from '@google/generative-ai'
import { SchemaType } from '@google/generative-ai'
import { eq } from 'drizzle-orm'
import type { H3Event, H3EventContext } from 'h3'
import { categories } from '~/constants/discover'
import { promptGeminiJson } from '~/utils/gemini'
import { internal, notFound } from '~/utils/nuxt'
import type { CharacterUpdate, User } from '~~/db/schema'
import { characterUsernames, contacts } from '~~/db/schema'

export async function getCharacterByUsername(
  orm: H3EventContext['orm'],
  username: string,
) {
  const result = await orm.query.characterUsernames.findFirst({
    where: eq(characterUsernames.username, username),
    with: {
      character: true,
    },
  })

  const character = result?.character

  if (!character)
    throw notFound('Character not found')

  return {
    ...character,
    conversationStarters: JSON.parse(character.conversationStarters),
    username,
    characterUsernameId: result.id,
  }
}

export async function getCharacterWithContactByUser(
  orm: H3EventContext['orm'],
  user: User,
  username: string,
) {
  const result = await orm.query.characterUsernames.findFirst({
    where: eq(characterUsernames.username, username),
    with: {
      character: {
        columns: {
          id: true,
          description: true,
          name: true,
        },
      },
      contacts: {
        columns: {
          id: true,
          name: true,
        },
        where: eq(contacts.userId, user.id!),
      },
    },
  })

  if (!result)
    throw notFound('Character Username not found')

  const character = result.character

  if (!character)
    throw notFound('Character not found')

  const contact = {
    name: result.contacts[0]?.name,
  }

  return {
    id: character.id,
    username: result.username,
    description: character.description,
    name: character.name,
    contact: result.contacts[0] ? contact : null,
  }
}

export async function categorizeCharacter(event: H3Event, data: CharacterUpdate) {
  const { GEMINI_API_KEY, GEMINI_MODEL } = useRuntimeConfig(event)

  if (!GEMINI_API_KEY)
    throw internal('GEMINI_API_KEY is not set in the environment')

  if (!GEMINI_MODEL)
    throw internal('GEMINI_MODEL is not set in the environment')

  const systemInstruction = `You are a character categorizer. You are expected to categorize the character based on the given data.`
  const characterData = {
    name: data.name,
    username: data.username,
    description: data.description,
    conversationStarters: data.conversationStarters,
    instructions: data.instructions,
  }
  const prompt = `${JSON.stringify(characterData, null, 2)}`

  const categoriesData = categories.map(category => ({
    name: category.name,
    description: category.description,
    example: category.example,
  }))
  const schema: ResponseSchema = {
    description: `
      Category of a character.

      ## Categories

      ${JSON.stringify(categoriesData, null, 2)}
    `,
    type: SchemaType.STRING,
    nullable: false,
    enum: categories.map(category => category.name),
  }

  const categoryName = await promptGeminiJson<string>({
    model: GEMINI_MODEL,
    apiKey: GEMINI_API_KEY,
    systemInstruction,
    prompt,
    responseSchema: schema,
  })

  const categoryId = categories.find(category => category.name === categoryName)?.id

  if (!categoryId)
    throw internal('AI did not return a valid category')

  return categoryId
}
