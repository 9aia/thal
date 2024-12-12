import process from "node:process"
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

  const prompt = `
    ## MISSION
    
    You are a character categorizer.

    ## CHARACTER

    ${JSON.stringify(data)}

    ## CATEGORIES

    ${JSON.stringify(categories)}

    ## OUTPUT FORMAT

    - Only the category id directly

    ## OUTPUT EXAMPLE

    1
  `

  const gemini = getGemini(GEMINI_API_KEY as string)
  const res = await gemini.generateContent(prompt)
  const bestCandidate = res.candidates?.[0]
  const bestPart = bestCandidate?.content?.parts?.[0]
  const text: string = bestPart?.text

  if (!text)
    throw internal("Gemini did not return a valid category")

  const categoryId = Number.parseInt(text)

  return categoryId
}
