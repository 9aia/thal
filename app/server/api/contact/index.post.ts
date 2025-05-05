import { and, eq } from 'drizzle-orm'
import { getCharacterByUsername } from '~/server/services/character'
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

  const result = await getCharacterByUsername(orm, data.username)

  try {
    const [newContact] = await orm
      .insert(contacts)
      .values({
        name: data.name,
        userId: user.id,
        characterUsernameId: result.characterUsernameId,
        createdAt: now().toString(),
      })
      .returning()

    await orm
      .update(chats)
      .set({ contactId: newContact.id })
      .where(
        and(
          eq(chats.userId, user.id),
          eq(chats.characterUsernameId, newContact.characterUsernameId),
        ),
      )
      .run()

    return {
      id: newContact.id,
      name: newContact.name,
      createdAt: newContact.createdAt,
      username: result.username,
    }
  }
  catch (_e) {
    const e = _e as Error

    if (e.message.includes('UNIQUE constraint'))
      throw badRequest('Contact already added')

    throw internal()
  }
})
