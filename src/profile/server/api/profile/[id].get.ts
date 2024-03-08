import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { users } from '~/src/base/server/db/schema'

export default eventHandler(async (event) => {
  const orm = event.context.orm
  const user = event.context.user

  const { username } = await getValidated(event, 'params', z.object({ username: z.string() }))

  if(!user) {
    throw unauthorized()
  }

  const profile = (
    await orm.select().from(users).where(eq(users.username, username))
  ).at(0)

  if (!profile) {
    throw notFound(`User not found: ${username}`)
  }

  return profile
})
