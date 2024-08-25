import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { getPersonaByUsername } from "~/server/services/persona"
import { getValidated } from "~/utils/h3"
import { unauthorized } from "~/utils/nuxt"
import { contacts, personas, usernameSchema } from "~~/db/schema"

export default eventHandler(async (event) => {
  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const { username } = await getValidated(event, "params", z.object({ username: z.string() }))

  if (!usernameSchema.safeParse(username).success) {
    return {
      personaNotFound: true,
      alreadyAdded: false,
      isUsernameValid: false,
    }
  }

  const [persona] = await orm
    .select()
    .from(personas)
    .where(eq(personas.username, username))

  if (!persona) {
    return {
      personaNotFound: true,
      alreadyAdded: false,
      isUsernameValid: true,
    }
  }

  const [contact] = await orm
    .select()
    .from(contacts)
    .where(and(eq(contacts.userId, user.id), eq(contacts.personaId, persona?.id)))

  return {
    personaNotFound: false,
    alreadyAdded: !!contact,
    isUsernameValid: true,
  }
})
