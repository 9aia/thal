import { eq } from "drizzle-orm"
import { z } from "zod"
import { personaUpdateSchema, personaUsernames, personas, usernameSchema } from "~~/db/schema"
import { getValidated } from "~/utils/h3"
import { forbidden, notFound, unauthorized } from "~/utils/nuxt"
import { personaBuilderData } from "~/store"

export default eventHandler(async (event) => {
  const { username } = await getValidated(event, "params", z.object({ username: usernameSchema }))

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const data = await getValidated(event, "body", personaUpdateSchema)

  const result = await orm.query.personaUsernames.findFirst({
    where: eq(personaUsernames.username, username),
    with: {
      persona: true,
    },
  })

  const persona = result?.persona

  if (!persona)
    throw notFound()

  if (persona.creatorId !== user.id)
    throw forbidden()

  const {
    username: personaUsername,
    ...personaData
  } = data

  const updatedPersona = await orm
    .update(personas)
    .set({
      ...personaData,
      conversationStarters: JSON.stringify(data.conversationStarters),
    })
    .where(eq(personas.id, persona.id))
    .returning()

  if (personaUsername !== result.username) {
    await orm.update(personaUsernames)
      .set({ username: personaUsername })
      .where(eq(personaUsernames.id, result.id))
  }

  return updatedPersona
})
