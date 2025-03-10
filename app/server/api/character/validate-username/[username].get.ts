import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { getValidated } from '~/utils/h3'
import { unauthorized } from '~/utils/nuxt'
import { characterUsernames, usernameSchema } from '~~/db/schema'

export default eventHandler(async (event) => {
  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const { username } = await getValidated(event, 'params', z.object({ username: z.string() }))
  const { allowedUsername } = await getValidated(event, 'query', z.object({ allowedUsername: z.string().optional() }))

  if (!usernameSchema.safeParse(username).success)
    return { valid: false }

  const [existingCharacterUsername] = await orm
    .select()
    .from(characterUsernames)
    .where(eq(characterUsernames.username, username))

  const isUsernameTaken = existingCharacterUsername && existingCharacterUsername.characterId !== null

  return {
    valid: username === allowedUsername || !isUsernameTaken,
  }
})
