import process from "node:process"
import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { getContactByUser } from "~/server/services/contact"
import { getHistory } from "~/server/services/messages"
import { now } from "~/utils/date"
import { chatHistoryToGemini, getGemini } from "~/utils/gemini"
import { getValidated } from "~/utils/h3"
import { internal, notFound, unauthorized } from "~/utils/nuxt"
import type { MessageInsert } from "~~/db/schema"
import { chats, messageSendSchema, messages, usernameSchema } from "~~/db/schema"

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

  const userDateTime = now().getTime()
  const history = await getHistory(orm, user, username)

  history.push({
    id: `${history.length + 1}`,
    from: "user",
    status: "sent",
    message: data.value,
    time: userDateTime,
  })

  const userMessage: MessageInsert = {
    chatId: chat.id,
    data,
    isBot: 0,
    createdAt: userDateTime,
  }

  const geminiHistory = chatHistoryToGemini(history)

  const gemini = getGemini(process.env.GEMINI_API_KEY!)

  const res = await gemini.respondChat(geminiHistory)

  const content = res.candidates[0].content
  const geminiResText = content?.parts?.[0]?.text

  if (!geminiResText)
    throw internal("Empty response")

  const geminiResTime = now().getTime()

  const geminiMessage: MessageInsert = {
    chatId: chat.id,
    data: { type: "text", value: geminiResText },
    isBot: 1,
    createdAt: geminiResTime,
  }

  const [_, dbGeminiMessage] = await orm
    .insert(messages)
    .values([
      userMessage,
      geminiMessage,
    ]).returning()

  history.push(
    {
      id: dbGeminiMessage.id.toString(),
      from: "bot",
      status: "sent",
      message: geminiResText,
      time: geminiResTime,
    },
  )

  return history
})
