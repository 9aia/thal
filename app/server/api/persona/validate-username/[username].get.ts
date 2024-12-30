import { eq } from "drizzle-orm"
import { z } from "zod"
import { getValidated } from "~/utils/h3"
import { unauthorized } from "~/utils/nuxt"
import { personaUsernames, usernameSchema } from "~~/db/schema"

export default eventHandler(async (event) => {
  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const { username } = await getValidated(event, "params", z.object({ username: z.string() }))
  const { allowedUsername } = await getValidated(event, "query", z.object({ allowedUsername: z.string().optional() }))

  if (!usernameSchema.safeParse(username).success)
    return { valid: false }

  const [existingPersonaUsername] = await orm
    .select()
    .from(personaUsernames)
    .where(eq(personaUsernames.username, username))

  const isUsernameTaken = existingPersonaUsername && existingPersonaUsername.personaId !== null

  return {
    valid: username === allowedUsername || !isUsernameTaken,
  }
})
