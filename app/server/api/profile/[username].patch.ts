import { and, eq, isNotNull } from 'drizzle-orm'
import { z } from 'zod'
import { userUpdateSchema, usernames, users } from '~~/db/schema'
import { getValidated } from '~/utils/h3'
import { forbidden, unauthorized } from '~/utils/nuxt'

export default eventHandler(async (event) => {
  const orm = event.context.orm
  const loggedUser = event.context.user

  const { username } = await getValidated(event, 'params', z.object({ username: z.string() }))
  const data = await getValidated(event, 'body', userUpdateSchema)

  if (!loggedUser)
    throw unauthorized()

  const usernameData = await orm.query.usernames.findFirst({
    where: and(eq(usernames.username, username), isNotNull(usernames.userId)),
    with: {
      user: true,
    },
  })

  if (loggedUser.id !== usernameData?.user?.id)
    throw forbidden()

  const result = await orm.batch([
    orm.update(usernames).set({
      username: data.username,
    }).where(eq(usernames.userId, usernameData?.user?.id)).returning(),
    orm.update(users).set(users).where(eq(users.id, usernameData?.user?.id)).returning(),
  ])

  const profile = {
    ...result[1][0],
    username: result[0][0].username,
  }

  return profile
})
