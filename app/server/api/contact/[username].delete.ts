import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { getContactByUsername } from '~/server/services/contact'
import { getValidated } from '~/utils/h3'
import { notFound, unauthorized } from '~/utils/nuxt'
import { contacts, usernameSchema } from '~~/db/schema'

export default eventHandler(async (event) => {
  const { username } = await getValidated(event, 'params', z.object({ username: usernameSchema }))

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const contact = await getContactByUsername(orm, user, username)

  if (!contact.id)
    throw notFound('Contact not found')

  const [deletedContact] = await orm
    .delete(contacts)
    .where(and(eq(contacts.userId, user.id), eq(contacts.id, contact.id)))
    .returning()

  const deletedContactDto = {
    id: deletedContact.id,
    name: deletedContact.name,
    createdAt: deletedContact.createdAt,
    updatedAt: deletedContact.updatedAt,
    username,
    userId: deletedContact.userId,
  }

  return deletedContactDto
})
