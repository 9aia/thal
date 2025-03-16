import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { getHistory } from '~/server/services/messages'
import { now } from '~/utils/date'
import { chatHistoryToGemini, getGemini } from '~/utils/gemini'
import { getValidated } from '~/utils/h3'
import { internal, notFound, paymentRequired, rateLimit, unauthorized } from '~/utils/nuxt'
import { isPlanActive, isPlanPastDue } from '~/utils/plan'
import type { MessageInsert } from '~~/db/schema'
import { characterUsernames, chats, contacts, lastMessages, messageSendSchema, messages, usernameSchema } from '~~/db/schema'

export default eventHandler(async (event) => {
  const { GEMINI_API_KEY, GEMINI_MODEL } = useRuntimeConfig(event)

  if (!GEMINI_API_KEY)
    throw internal('GEMINI_API_KEY is not set in the environment')

  if (!GEMINI_MODEL)
    throw internal('GEMINI_MODEL is not set in the environment')

  const user = event.context.user

  if (!user)
    throw unauthorized()

  if (isPlanPastDue(user)) {
    throw paymentRequired('PAST_DUE')
  }

  if (!isPlanActive(user)) {
    throw paymentRequired('PAYMENT_REQUIRED')
  }

  const { success } = await event.context.cloudflare.env.MESSAGE_RATE_LIMIT.limit({ key: `send-message-${user.id}` })

  if (!success) {
    throw rateLimit()
  }

  const { username } = await getValidated(event, 'params', z.object({ username: usernameSchema }))

  const data = await getValidated(event, 'body', messageSendSchema)

  const orm = event.context.orm

  const result = await orm.query.characterUsernames.findFirst({
    where: eq(characterUsernames.username, username),
    with: {
      character: {
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
    throw notFound('Character Username not found')

  const character = result.character

  if (!character)
    throw internal('Character not found')

  const contact = result.contacts[0]
  let chat = result.chats[0]

  if (!chat) {
    const [newChat] = await orm
      .insert(chats)
      .values({
        userId: user.id!,
        contactId: contact?.id,
        characterUsernameId: result.id,
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
    timeZone: 'America/Sao_Paulo',
    hour12: false,
  })

  const SYSTEM_INSTRUCTIONS = `
    You are ${character.name} (username: ${result.username}). **You do not engage in any language other than English.** If the user sends a message in another language, **do not translate, interpret, or respond in that language.** Instead, inform them that you only are going to chat in English.

    Maintain a **natural, conversational tone** with concise and engaging responses. Avoid long-winded explanations—keep it chat-like.

    **Respond in markdown if necessary but prioritize plain text.**

    **Current time:** ${datetime}.

    **Your description:** ${character.description}.

    ## Instructions

    ${character.instructions}
  `

  const geminiHistory = chatHistoryToGemini(history)
  const res = await gemini.respondChat(geminiHistory, GEMINI_MODEL, SYSTEM_INSTRUCTIONS)

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
