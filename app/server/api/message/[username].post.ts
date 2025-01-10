import process from 'node:process'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { getHistory } from '~/server/services/messages'
import { now } from '~/utils/date'
import { chatHistoryToGemini, getGemini } from '~/utils/gemini'
import { getValidated } from '~/utils/h3'
import { internal, notFound, unauthorized } from '~/utils/nuxt'
import type { MessageInsert } from '~~/db/schema'
import { chats, contacts, lastMessages, messageSendSchema, messages, personaUsernames, usernameSchema } from '~~/db/schema'

export default eventHandler(async (event) => {
  const { GEMINI_API_KEY } = process.env

  if (!GEMINI_API_KEY)
    throw internal('GEMINI_API_KEY is not set in the environment')

  const { username } = await getValidated(event, 'params', z.object({ username: usernameSchema }))

  const data = await getValidated(event, 'body', messageSendSchema)

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
        where: eq(chats.userId, user.id!),
      },
      contacts: {
        where: eq(contacts.userId, user.id!),
      },
    },
  })

  if (!result)
    throw notFound('Persona Username not found')

  const persona = result.persona

  if (!persona)
    throw internal('Persona not found')

  const contact = result.contacts[0]
  let chat = result.chats[0]

  if (!chat) {
    const [newChat] = await orm
      .insert(chats)
      .values({
        userId: user.id!,
        contactId: contact?.id,
        personaUsernameId: result.id,
        createdAt: now().toString(),
      })
      .returning()

    chat = newChat
  }

  const userMessageTime = now().getTime()
  const { history } = await getHistory(orm, user, username)

  history.push({
    id: history.length + 1,
    from: 'user',
    status: 'seen',
    message: data.value,
    replyMessage: data.replyMessage,
    replyingId: data.replyingId,
    replyFrom: data.replyFrom,
    time: userMessageTime,
  })

  const userMessage: MessageInsert = {
    chatId: chat.id,
    data: {
      type: data.type,
      value: data.value,
    },
    isBot: 0,
    createdAt: userMessageTime,
    replyingId: data.replyingId,
  }

  const gemini = getGemini(GEMINI_API_KEY)

  const datetime = new Date(userMessageTime).toLocaleString('en-US', {
    timeZone: 'UTC',
    hour12: false,
  })

  const SYSTEM_INSTRUCTIONS = `
    You are ${persona.name}, and your username is ${result.username}. Respond in English and maintain a conversational tone. Act like you're chatting with the user, ${user.name} ${user.lastName} (username: ${user.username}). Keep your replies natural and avoid long, narrative-style responses. Stick to the flow of a chat.

    ANSWER IN PURE TEXT. Do not include any special formatting.

    Time: ${datetime}.

    Your description: ${persona.description}.

    ## Instructions
    
    ${persona.instructions}
  `

  const geminiHistory = chatHistoryToGemini(history)
  const res = await gemini.respondChat(geminiHistory, SYSTEM_INSTRUCTIONS)

  const content = res.candidates[0].content
  const geminiResText = content?.parts?.[0]?.text

  if (!geminiResText)
    throw internal('Empty response')

  const botMessageTime = now().getTime()
  const botMessageContent = geminiResText

  const botMessagePayload: MessageInsert = {
    chatId: chat.id,
    data: { type: 'text', value: botMessageContent },
    isBot: 1,
    createdAt: botMessageTime,
  }

  const [_, botMessageRecord] = await orm
    .insert(messages)
    .values([
      userMessage,
      botMessagePayload,
    ]).returning()

  const lastMessage = await orm.query.lastMessages.findFirst({
    where: eq(messages.chatId, chat.id),
  })

  const hasLastMessage = !!lastMessage

  if (hasLastMessage) {
    await orm.update(lastMessages).set({
      content: botMessageContent,
      datetime: new Date(botMessageTime),
    }).where(eq(lastMessages.chatId, chat.id))
  }
  else {
    await orm.insert(lastMessages).values({
      chatId: chat.id,
      content: botMessageContent,
      datetime: new Date(botMessageTime),
      userId: user!.id!,
    })
  }

  history.push(
    {
      id: botMessageRecord.id,
      from: 'bot',
      status: 'seen',
      message: botMessageContent,
      time: botMessageTime,
    },
  )

  return history
})
