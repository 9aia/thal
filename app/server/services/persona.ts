import { eq } from "drizzle-orm"
import type { H3EventContext } from "h3"
import type { User } from "lucia"
import { notFound } from "~/utils/nuxt"
import { contacts, personas } from "~~/db/schema"

export async function getPersonaByUsername(
  orm: H3EventContext["orm"],
  username: string,
) {
  const [persona] = await orm
    .select().from(personas)
    .where(eq(personas.username, username))

  if (!persona)
    throw notFound("Persona not found")

  return persona
}

export async function getPersonaWithContactByUser(
  orm: H3EventContext["orm"],
  user: User,
  username: string,
) {
  const result = await orm.query.personas.findFirst({
    columns: {
      id: true,
      username: true,
      description: true,
      name: true,
    },
    where: eq(personas.username, username),
    with: {
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
    throw notFound("Persona not found")

  const contact = {
    name: result.contacts[0]?.name,
  }

  return {
    id: result.id,
    username: result.username,
    description: result.description,
    name: result.name,
    contact: result.contacts[0] ? contact : null,
  }
}
