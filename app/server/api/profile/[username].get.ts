import { eq } from "drizzle-orm"
import { z } from "zod"
import { users } from "~~/db/schema"
import { getValidated } from "~/utils/h3"
import { forbidden, notFound, unauthorized } from "~/utils/nuxt"

export default eventHandler(async (event) => {
  const { username } = await getValidated(event, "params", z.object({ username: z.string() }))

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const profile = (
    await orm.select().from(users).where(eq(users.username, username))
  ).at(0)

  if (!profile)
    throw notFound(`User not found: ${username}`)

  // if (user.username !== username)
  //   throw forbidden(`You are not allowed to view this profile: ${username}`)

  return profile
})
