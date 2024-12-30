import { eq } from "drizzle-orm"
import { z } from "zod"
import { personaUsernames, personas, usernameSchema } from "~~/db/schema"
import { getValidated } from "~/utils/h3"
import { forbidden, notFound, unauthorized } from "~/utils/nuxt"

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

  if (result.persona.creatorId !== user.id)
    throw forbidden()

  const deletedPersona = await orm
    .delete(personas)
    .where(eq(personas.id, result?.persona.id))
    .returning()

  return deletedPersona
})
