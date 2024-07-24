import { eq } from "drizzle-orm"
import { z } from "zod"
import { getValidated } from "~/utils/h3"
import { notFound, unauthorized } from "~/utils/nuxt"
import { personas, usernameSchema } from "~~/db/schema"

export default eventHandler(async (event) => {
  const { username } = await getValidated(event, "params", z.object({ username: usernameSchema }))

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const [persona] = await orm.select().from(personas)
    .where(eq(personas.username, username))

  if (!persona)
    throw notFound()

  return persona
})
