import { and, eq, isNull } from 'drizzle-orm'
import { now } from '~/utils/date'
import { getValidated } from '~/utils/h3'
import { badRequest, notFound, unauthorized } from '~/utils/nuxt'
import { chats, contactInsertSchema, contacts, usernames } from '~~/db/schema'

export default eventHandler(async (event) => {
  const data = await getValidated(event, 'body', contactInsertSchema)

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const result = await orm.query.usernames.findFirst({
    where: eq(usernames.text, data.username),
    with: {
      contacts: {
        columns: {
          id: true,
        },
        where: and(
          eq(contacts.userId, user.id),
          isNull(contacts.deletedAt),
        ),
      },
    },
  })

  if (!result)
    throw notFound('Username not found')

  const usernameId = result.id
  const contact = result.contacts[0]

  if (contact)
    throw badRequest('Contact already added')

  const [newContact] = await orm
    .insert(contacts)
    .values({
      name: data.name,
      userId: user.id,
      usernameId,
    })
    .returning()

  await orm
    .update(chats)
    .set({
      contactId: newContact.id,
      updatedAt: now(),
    })
    .where(
      and(
        eq(chats.userId, user.id),
        eq(chats.usernameId, newContact.usernameId),
      ),
    )
    .run()

  return {
    id: newContact.id,
    name: newContact.name,
    createdAt: newContact.createdAt,
    username: data.username,
  }
})
