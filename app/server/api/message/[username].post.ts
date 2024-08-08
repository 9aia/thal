import { z } from "zod"
import { and, eq } from "drizzle-orm"
import { getValidated } from "~/utils/h3"
import { notFound, unauthorized } from "~/utils/nuxt"
import { chats, messageSendSchema, messages, usernameSchema } from "~~/db/schema"
import { getPersonaByUsername } from "~/server/services/persona"
import { now } from "~/utils/date"
import { getHistory } from "~/server/services/messages"

export default eventHandler(async (event) => {
  const { username } = await getValidated(event, "params", z.object({ username: usernameSchema }))

  const data = await getValidated(event, "body", messageSendSchema)

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const persona = await getPersonaByUsername(orm, username)

  if (!persona)
    throw notFound("Persona not found")

  const [existingChat] = await orm
    .select()
    .from(chats)
    .where(
      and(
        eq(chats.userId, user.id),
        eq(chats.personaId, persona.id),
      ),
    )

  let chat = existingChat

  if (!chat) {
    const [newChat] = await orm
      .insert(chats)
      .values({
        userId: user.id,
        personaId: persona.id,
        createdAt: now().toString(),
      })
      .returning()

    chat = newChat
  }

  await orm
    .insert(messages)
    .values({
      chatId: chat.id,
      content: data.message,
      createdAt: now().toString(),
    })

  // const history = await getHistory(orm, user, persona)

  return {
    response: "Random response",
  }
})
