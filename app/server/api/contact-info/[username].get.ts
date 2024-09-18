import { z } from "zod"
import { eq } from "drizzle-orm"
import { getValidated } from "~/utils/h3"
import { badRequest, unauthorized } from "~/utils/nuxt"
import { contacts, personaUsernames, personas, usernameSchema } from "~~/db/schema"

export default eventHandler(async (event) => {
  const { username } = await getValidated(event, "params", z.object({ username: usernameSchema }))

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const contactGetDto = await orm.query.personaUsernames.findFirst({
    where: eq(personaUsernames.username, username),
    columns: {
      username: true,
    },
    with: {
      persona: {
        columns: {
          name: true,
          description: true,
        },
      },
      contacts: {
        where: eq(contacts.userId, user.id),
        columns: {
          name: true,
        },
      },
    },
  })

  if (!contactGetDto)
    throw badRequest("Persona not found")

  const contact = contactGetDto?.contacts[0]
  delete (contactGetDto as any).contacts

  return {
    ...contactGetDto as Omit<typeof contactGetDto, "contacts">,
    contact,
  }
})
