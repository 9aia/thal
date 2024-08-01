import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { getContactWithPersonaByUser } from "~/server/services/contact"
import { getValidated } from "~/utils/h3"
import { unauthorized } from "~/utils/nuxt"
import { contactUpdateSchema, contacts, usernameSchema } from "~~/db/schema"

export default eventHandler(async (event) => {
  const { username } = await getValidated(event, "params", z.object({ username: usernameSchema }))
  const data = await getValidated(event, "body", contactUpdateSchema)

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const contact = await getContactWithPersonaByUser(orm, user, username)

  const [updatedContact] = await orm
    .update(contacts)
    .set(data)
    .where(and(eq(contacts.userId, user.id), eq(contacts.personaId, contact.personaId)))
    .returning()

  const contactUpdateDto = {
    id: updatedContact.id,
    name: updatedContact.name,
    createdAt: updatedContact.createdAt,
    username,
  }

  return contactUpdateDto
})
