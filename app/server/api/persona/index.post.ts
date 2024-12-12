import { eq } from "drizzle-orm"
import { categorizePersona } from "~/server/services/persona"
import { now } from "~/utils/date"
import { getValidated } from "~/utils/h3"
import { badRequest, unauthorized } from "~/utils/nuxt"
import { personaInsertSchema, personaUsernames, personas } from "~~/db/schema"

export default eventHandler(async (event) => {
  const data = await getValidated(event, "body", personaInsertSchema)

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const {
    username,
    ...personaData
  } = data

  const [existingPersonaUsername] = await orm
    .select()
    .from(personaUsernames)
    .where(eq(personaUsernames.username, username))

  if (existingPersonaUsername && existingPersonaUsername.personaId !== null)
    throw badRequest("Username already taken")

  const categoryId = await categorizePersona(data)

  console.log("categoryId", categoryId)

  const [newPersona] = await orm
    .insert(personas)
    .values({
      ...personaData,
      conversationStarters: JSON.stringify(personaData.conversationStarters),
      creatorId: user.id,
      createdAt: now().toString(),
      categoryId,
    })
    .returning()

  const isNewPersonaUsername = existingPersonaUsername === undefined

  if (isNewPersonaUsername) {
    await orm.insert(personaUsernames).values({
      username,
      personaId: newPersona.id,
    })
  }
  else {
    await orm
      .update(personaUsernames)
      .set({
        personaId: newPersona.id,
      })
      .where(eq(personaUsernames.username, username))
  }

  return {
    ...newPersona,
    username,
  }
})
