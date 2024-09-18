import { eq } from "drizzle-orm"
import type { H3EventContext } from "h3"
import type { User } from "lucia"
import { notFound } from "~/utils/nuxt"
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
