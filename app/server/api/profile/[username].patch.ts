import { and, eq, isNotNull } from 'drizzle-orm'
import { z } from 'zod'
import { now } from '~/utils/date'
import { getValidated } from '~/utils/h3'
import { forbidden, unauthorized } from '~/utils/nuxt'
import { userUpdateSchema, usernames, users } from '~~/db/schema'

export default eventHandler(async (event) => {
  const { username } = await getValidated(event, 'params', z.object({ username: z.string() }))
  const data = await getValidated(event, 'body', userUpdateSchema)

  const orm = event.context.orm
  const loggedUser = event.context.user

  if (!loggedUser)
    throw unauthorized()

  const usernameData = await orm.query.usernames.findFirst({
    where: and(eq(usernames.text, username), isNotNull(usernames.userId)),
    with: {
      user: {
        columns: {
          id: true,
        },
      },
    },
  })

  if (loggedUser.id !== usernameData?.user?.id)
    throw forbidden()

  const updateUsername = orm.update(usernames)
    .set({
      text: data.username,
      updatedAt: now(),
    })
    .where(eq(usernames.userId, usernameData?.user?.id))
    .returning({
      username: usernames.text,
    })
  const updateUser = orm.update(users)
    .set({ ...users, updatedAt: now() })
    .where(eq(users.id, usernameData?.user?.id))
    .returning({
      name: users.name,
      lastName: users.lastName,
      pronouns: users.pronouns,
    })

  const [usernameResults, userResults] = await orm.batch([updateUsername, updateUser])
  const usernameResult = usernameResults[0]
  const userResult = userResults[0]

  const profile = {
    ...userResult,
    username: usernameResult.username,
  }

  return profile
})
