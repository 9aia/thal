import { z } from "zod"
import { and, eq } from "drizzle-orm"
import { getValidated } from "~/utils/h3"
import { notFound, unauthorized } from "~/utils/nuxt"
import { chats, messageSendSchema, messages, usernameSchema } from "~~/db/schema"
import { getPersonaByUsername } from "~/server/services/persona"
import { now } from "~/utils/date"
import { getHistory } from "~/server/services/messages"
import { getContactByUser } from "~/server/services/contact"

export default eventHandler(async (event) => {
  const { username } = await getValidated(event, "params", z.object({ username: usernameSchema }))

  const data = await getValidated(event, "body", messageSendSchema)

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const contact = await getContactByUser(orm, user, username)

  if (!contact)
    throw notFound("Contact not found")

  if (!contact.personaId)
    throw notFound("Persona not found")

  const [existingChat] = await orm
    .select()
    .from(chats)
    .where(
      and(
        eq(chats.userId, user.id),
        eq(chats.personaId, contact.personaId),
      ),
    )

  let chat = existingChat

  if (!chat) {
    const [newChat] = await orm
      .insert(chats)
      .values({
        userId: user.id,
        contactId: contact.id,
        personaId: contact.personaId,
        createdAt: now().toString(),
      })
      .returning()

    chat = newChat
  }

  await orm
    .insert(messages)
    .values({
      chatId: chat.id,
      data,
      isBot: 0,
      createdAt: now().toString(),
    })

  // const history = await getHistory(orm, user, persona)

  return {
    response: "Random response",
  }
})
