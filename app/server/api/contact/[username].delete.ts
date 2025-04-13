import { and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { getContactByUser } from '~/server/services/contact'
import { getValidated } from '~/utils/h3'
import { unauthorized } from '~/utils/nuxt'
import { contacts, usernameSchema } from '~~/db/schema'

export default eventHandler(async (event) => {
  const { username } = await getValidated(event, 'params', z.object({ username: usernameSchema }))
  const { locale } = await getValidated(event, 'query', z.object({ locale: z.string() }))

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const contact = await getContactByUser(orm, user, username, locale)

  const [deletedContact] = await orm
    .delete(contacts)
    .where(and(eq(contacts.userId, user.id), eq(contacts.id, contact.id)))
    .returning()

  const contactDeleteDto = {
    id: deletedContact.id,
    name: deletedContact.name,
    createdAt: deletedContact.createdAt,
    username,
  }

  return contactDeleteDto
})
