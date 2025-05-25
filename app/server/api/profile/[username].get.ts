import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { getValidated } from '~/utils/h3'
import { forbidden, notFound, unauthorized } from '~/utils/nuxt'
import { usernameSchema, usernames } from '~~/db/schema'

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

  const userUsername = await orm.query.usernames.findFirst({
    with: {
      user: true,
    },
    where: eq(usernames.username, username),
  })

  if (!userUsername)
    throw notFound(`User not found: ${username}`)

  return userUsername.user
})
