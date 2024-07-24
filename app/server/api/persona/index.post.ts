import { now } from "~/utils/date"
import { getValidated } from "~/utils/h3"
import { unauthorized } from "~/utils/nuxt"
import { personaInsertSchema, personas } from "~~/db/schema"

export default eventHandler(async (event) => {
  const data = await getValidated(event, "body", personaInsertSchema)

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const newPersona = await orm
    .insert(personas)
    .values({
      ...data,
      creatorId: user.id,
      createdAt: now().toString(),
    })
    .returning()

  return newPersona
})
