import { eq } from "drizzle-orm"
import { z } from "zod"
import { getValidated } from "~/utils/h3"
import { personas, usernameSchema } from "~~/db/schema"

export default eventHandler(async (event) => {
  const orm = event.context.orm

  const { username } = await getValidated(event, "params", z.object({ username: z.string() }))

  if (!usernameSchema.safeParse(username).success)
    return { valid: false }

  const usernameTaken
    = (
      await orm
        .select()
        .from(personas)
        .where(eq(personas.username, username))
    ).at(0) !== undefined

  return {
    valid: !usernameTaken,
  }
})
