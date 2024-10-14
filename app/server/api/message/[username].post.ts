import process from "node:process"
import { eq } from "drizzle-orm"
import { z } from "zod"
import { getHistory } from "~/server/services/messages"
import { now } from "~/utils/date"
import { chatHistoryToGemini, getGemini } from "~/utils/gemini"
import { getValidated } from "~/utils/h3"
import { internal, notFound, unauthorized } from "~/utils/nuxt"
import type { MessageInsert } from "~~/db/schema"
import { chats, contacts, messageSendSchema, messages, personaUsernames, usernameSchema } from "~~/db/schema"
import { lastMessages } from "~~/db/schema/lastMessages"
import { addReplyToMessage } from "~/utils/chat"

export default eventHandler(async (event) => {
  const { username } = await getValidated(event, "params", z.object({ username: usernameSchema }))

  const data = await getValidated(event, "body", messageSendSchema)

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const result = await orm.query.personaUsernames.findFirst({
    where: eq(personaUsernames.username, username),
    with: {
      persona: {
        columns: {
          name: true,
          description: true,
          instructions: true,
        },
      },
      chats: {
        where: eq(chats.userId, user.id),
      },
      contacts: {
        where: eq(contacts.userId, user.id),
      },
    },
  })

  if (!result)
    throw notFound("Persona Username not found")

  const persona = result.persona

  if (!persona)
    throw internal("Persona not found")

  const contact = result.contacts[0]
  const existingChat = result.chats[0]

  let chat = existingChat

  if (!chat) {
    const [newChat] = await orm
      .insert(chats)
      .values({
        userId: user.id,
        contactId: contact?.id,
        personaUsernameId: result.id,
        createdAt: now().toString(),
      })
      .returning()

    chat = newChat
  }

  const userDateTime = now().getTime()
  const history = await getHistory(orm, user, username)

  const fullMessage = addReplyToMessage(data.value, data.replyMessage)

  history.push({
    id: history.length + 1,
    from: "user",
    status: "seen",
    message: fullMessage,
    time: userDateTime,
  })

  const userMessage: MessageInsert = {
    chatId: chat.id,
    data: {
      type: data.type,
      value: data.value,
    },
    isBot: 0,
    createdAt: userDateTime,
    replyingId: data.replyingId,
  }

  const gemini = getGemini(process.env.GEMINI_API_KEY!)

  const SYSTEM_INSTRUCTIONS = `
    Your name is ${persona.name}, your username is ${result.username}.

    This is your description:
    ${persona.description}.

    You should behave like a character, following those instructions:
    ${persona.instructions}.

    ## Your Mission
    
    You should speak English.
    You are talking to a user named ${user.name} ${user.lastName}, their username is ${user.username}.
  `

  const geminiHistory = chatHistoryToGemini(history)
  const res = await gemini.respondChat(geminiHistory, SYSTEM_INSTRUCTIONS)

  const content = res.candidates[0].content
  const geminiResText = content?.parts?.[0]?.text

  if (!geminiResText)
    throw internal("Empty response")

  const geminiResTime = now().getTime()

  const messageContent = geminiResText

  const geminiMessage: MessageInsert = {
    chatId: chat.id,
    data: { type: "text", value: messageContent },
    isBot: 1,
    createdAt: geminiResTime,
  }

  const [_, dbGeminiMessage] = await orm
    .insert(messages)
    .values([
      userMessage,
      geminiMessage,
    ]).returning()

  await orm.insert(lastMessages).values({
    chatId: chat.id,
    content: messageContent.slice(0, 32),
  })

  history.push(
    {
      id: dbGeminiMessage.id,
      from: "bot",
      status: "seen",
      message: messageContent,
      time: geminiResTime,
    },
  )

  return history
})
