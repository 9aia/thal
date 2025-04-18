import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { userUpdateSchema, users } from '~~/db/schema'
import { getValidated } from '~/utils/h3'
import { forbidden, unauthorized } from '~/utils/nuxt'

export default eventHandler(async (event) => {
  const orm = event.context.orm
  const user = event.context.user

  const { username } = await getValidated(event, 'params', z.object({ username: z.string() }))
  const data = await getValidated(event, 'body', userUpdateSchema)

  if (!user)
    throw unauthorized()

  if (user.username !== username)
    throw forbidden()

  const profile = await orm
    .update(users)
    .set(data)
    .where(eq(users.username, username))
    .returning()

  return profile
})
