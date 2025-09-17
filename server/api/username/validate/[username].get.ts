import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { getValidated } from '~~/server/utils/h3'
import { unauthorized } from '~~/server/utils/nuxt'
import { usernameSchema, usernames } from '~~/db/schema'

export default eventHandler(async (event) => {
  const { username } = await getValidated(event, 'params', z.object({
    username: z.string(),
  }))

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  if (!usernameSchema.safeParse(username).success)
    return { invalidSyntax: true, taken: false }

  const [existingUsername] = await orm
    .select()
    .from(usernames)
    .where(eq(usernames.text, username))

  const isUsernameTaken = !!existingUsername && existingUsername.characterId !== null

  return {
    invalidSyntax: false,
    taken: isUsernameTaken,
  }
})
