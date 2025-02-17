import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { usernameSchema, users } from '~~/db/schema'
import { getValidated } from '~/utils/h3'
import { unauthorized } from '~/utils/nuxt'

export default eventHandler(async (event) => {
  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const { username } = await getValidated(event, 'params', z.object({ username: z.string() }))

  if (!usernameSchema.safeParse(username).success)
    return { valid: false }

  const usernameTaken
    = (
      await orm
        .select()
        .from(users)
        .where(eq(users.username, username))
    ).at(0) !== undefined

  return {
    valid: !usernameTaken,
  }
})
