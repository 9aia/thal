import { and, eq } from 'drizzle-orm'
import { mapContactToDto } from '~/server/services/contact'
import { getPersonaByUsername } from '~/server/services/persona'
import { now } from '~/utils/date'
import { getValidated } from '~/utils/h3'
import { badRequest, internal, unauthorized } from '~/utils/nuxt'
import { chats, contactInsertSchema, contacts } from '~~/db/schema'

export default eventHandler(async (event) => {
  const data = await getValidated(event, 'body', contactInsertSchema)

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const result = await getPersonaByUsername(orm, data.username)

  try {
    const [newContact] = await orm
      .insert(contacts)
      .values({
        name: data.name,
        userId: user.id,
        personaUsernameId: result.personaUsernameId,
        createdAt: now().toString(),
      })
      .returning()

    await orm
      .update(chats)
      .set({ contactId: newContact.id })
      .where(
        and(
          eq(chats.userId, user.id),
          eq(chats.personaUsernameId, newContact.personaUsernameId),
        ),
      )
      .run()

    return mapContactToDto(newContact, result)
  }
  catch (_e) {
    const e = _e as Error

    if (e.message.includes('UNIQUE constraint'))
      throw badRequest('Contact already added')

    throw internal()
  }
})
