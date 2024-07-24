import { eq } from "drizzle-orm"
import { z } from "zod"
import { personas, usernameSchema } from "~~/db/schema"
import { getValidated } from "~/utils/h3"
import { forbidden, notFound, unauthorized } from "~/utils/nuxt"

export default eventHandler(async (event) => {
  const { username } = await getValidated(event, "params", z.object({ username: usernameSchema }))

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const [persona] = await orm
    .select().from(personas)
    .where(eq(personas.username, username))

  if (!persona)
    throw notFound()

  if (persona.creatorId !== user.id)
    throw forbidden()

  const deletedPersona = await orm
    .delete(personas)
    .where(eq(personas.username, username))
    .returning()

  return deletedPersona
})
