import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { getValidated } from '~/utils/h3'
import { forbidden, notFound, unauthorized } from '~/utils/nuxt'
import { usernameSchema, users } from '~~/db/schema'

export default eventHandler(async (event) => {
  const orm = event.context.orm
  const user = event.context.user

  const { username } = await getValidated(event, 'params', z.object({
    username: usernameSchema,
  }))

  if (!user)
    throw unauthorized()

  if (user.username !== username)
    throw forbidden(`You are not allowed to view this profile: ${username}`)

  const [profile] = await orm.select()
    .from(users)
    .where(eq(users.username, username))

  if (!profile)
    throw notFound(`User not found: ${username}`)

  return profile
})
