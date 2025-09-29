import { eq } from 'drizzle-orm'
import { now } from '#shared/utils/date'
import { getValidated } from '~~/server/utils/h3'
import { unauthorized } from '~~/server/utils/nuxt'
import { profileUpdateSchema, usernames, users } from '~~/server/db/schema'

export default eventHandler(async (event) => {
  const data = await getValidated(event, 'body', profileUpdateSchema)

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const updateUsername = orm.update(usernames)
    .set({
      text: data.username,
      updatedAt: now(),
    })
    .where(eq(usernames.userId, user.id))
    .returning({
      username: usernames.text,
    })

  const updateUser = orm.update(users)
    .set({ ...data, updatedAt: now() })
    .where(eq(users.id, user.id))
    .returning({
      name: users.name,
      lastName: users.lastName,
    })

  const shouldUpdateUsername = data.username && data.username !== user.username

  const [userResults, usernameResults] = await orm.batch(shouldUpdateUsername ? [updateUser, updateUsername] : [updateUser])
  const userResult = userResults[0]
  const usernameResult = usernameResults?.[0]

  const profile = {
    ...userResult,
    username: usernameResult?.username || user.username,
  }

  return profile
})
