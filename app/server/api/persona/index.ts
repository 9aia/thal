import { eq } from "drizzle-orm"
import { unauthorized } from "~/utils/nuxt"
import { personaUsernames, personas } from "~~/db/schema"

export default eventHandler(async (event) => {
  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const result = await orm.select({
    id: personas.id,
    name: personas.name,
    description: personas.description,
    instructions: personas.instructions,
    username: personaUsernames.username,
    categoryId: personas.categoryId,
    discoverable: personas.discoverable,
  })
    .from(personas)
    .where(eq(personas.creatorId, user.id!))
    .leftJoin(personaUsernames, eq(personaUsernames.personaId, personas.id))

  return result
})
