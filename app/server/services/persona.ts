import process from "node:process"
import type { ResponseSchema } from "@google/generative-ai"
import { SchemaType } from "@google/generative-ai"
import { eq } from "drizzle-orm"
import type { H3EventContext } from "h3"
import { categories } from "~/constants/discover"
import { getGemini } from "~/utils/gemini"
import { internal, notFound } from "~/utils/nuxt"
import type { PersonaUpdate, User } from "~~/db/schema"
import { contacts, personaUsernames } from "~~/db/schema"

export async function getPersonaByUsername(
  orm: H3EventContext["orm"],
  username: string,
) {
  const result = await orm.query.personaUsernames.findFirst({
    where: eq(personaUsernames.username, username),
    with: {
      persona: true,
    },
  })

  const persona = result?.persona

  if (!persona)
    throw notFound("Persona not found")

  return {
    ...persona,
    conversationStarters: JSON.parse(persona.conversationStarters),
    username,
    personaUsernameId: result.id,
  }
}

export async function getPersonaWithContactByUser(
  orm: H3EventContext["orm"],
  user: User,
  username: string,
) {
  const result = await orm.query.personaUsernames.findFirst({
    where: eq(personaUsernames.username, username),
    with: {
      persona: {
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
        where: eq(contacts.userId, user.id),
      },
    },
  })

  if (!result)
    throw notFound("Persona Username not found")

  const persona = result.persona

  if (!persona)
    throw notFound("Persona not found")

  const contact = {
    name: result.contacts[0]?.name,
  }

  return {
    id: persona.id,
    username: result.username,
    description: persona.description,
    name: persona.name,
    contact: result.contacts[0] ? contact : null,
  }
}

export async function categorizePersona(data: PersonaUpdate) {
  const { GEMINI_API_KEY } = process.env

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

  const gemini = getGemini(GEMINI_API_KEY as string)
  const res = await gemini.generateContent(prompt, systemInstruction, {
    responseMimeType: "application/json",
    responseSchema: schema,
  })

  const bestCandidate = res.candidates?.[0]
  const bestPart = bestCandidate?.content?.parts?.[0]
  const text: string = bestPart?.text

  if (!text)
    throw internal("AI did not return a valid category")

  let categoryName: string

  try {
    categoryName = JSON.parse(text)
  }
  catch (_e) {
    const e = _e as Error
    throw internal(`Error while parsing Gemini response: ${e.message}`)
  }

  const categoryId = categories.find(category => category.name === categoryName)?.id

  if (!categoryId)
    throw internal("AI did not return a valid category")

  return categoryId
}
