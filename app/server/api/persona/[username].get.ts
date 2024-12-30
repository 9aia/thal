import { eq } from "drizzle-orm"
import { z } from "zod"
import { getValidated } from "~/utils/h3"
import { notFound, unauthorized } from "~/utils/nuxt"
import { personaUsernames, usernameSchema } from "~~/db/schema"

export default eventHandler(async (event) => {
  const { username } = await getValidated(event, "params", z.object({ username: usernameSchema }))

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const result = await orm.query.personaUsernames.findFirst({
    where: eq(personaUsernames.username, username),
    with: {
      persona: true,
    },
  })

  if (!result?.persona)
    throw notFound()

  return {
    ...result.persona,
    username,
  }
})
