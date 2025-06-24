import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { getHistory } from '~/server/services/messages'
import { now } from '~/utils/date'
import { chatHistoryToGemini, sendGeminiTextInTextOut } from '~/utils/gemini'
import { getValidated } from '~/utils/h3'
import { internal, notFound, paymentRequired, rateLimit, unauthorized } from '~/utils/nuxt'
import { isPlanActive, isPlanPastDue } from '~/utils/plan'
import type { MessageInsert } from '~~/db/schema'
import { MessageStatus, characterLocalizations, chats, contacts, lastMessages, messageSendSchema, messages, usernameSchema, usernames } from '~~/db/schema'

export default eventHandler(async (event) => {
  const { GEMINI_API_KEY, GEMINI_MODEL } = useRuntimeConfig(event)

  if (!GEMINI_API_KEY)
    throw internal('GEMINI_API_KEY is not set in the environment')

  if (!GEMINI_MODEL)
    throw internal('GEMINI_MODEL is not set in the environment')

  const { username } = await getValidated(event, 'params', z.object({ username: usernameSchema }))
  const data = await getValidated(event, 'body', messageSendSchema)

  const user = event.context.user

  if (!user)
    throw unauthorized()

  if (isPlanPastDue(user))
    throw paymentRequired('PAST_DUE')

  if (!isPlanActive(user))
    throw paymentRequired('PAYMENT_REQUIRED')

  const messageRateLimit = await event.context.cloudflare.env.MESSAGE_RATE_LIMIT.limit({ key: `send-message-${user.id}` })

  if (!messageRateLimit.success)
    throw rateLimit()

  const orm = event.context.orm

  const result = await orm.query.usernames.findFirst({
    where: eq(usernames.text, username),
    columns: {
      id: true,
    },
    with: {
      character: {
        columns: {},
        with: {
          characterLocalizations: {
            columns: {
              name: true,
              description: true,
              instructions: true,
            },
            where: eq(characterLocalizations.locale, 'en-US'),
          },
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
    throw notFound('Username not found')

  const character = result.character

  if (!character)
    throw notFound('Character not found')

  const contact = result.contacts[0]
  let chat = result.chats[0]

  // #region Create chat if it doesn't exist

  if (!chat) {
    const [newChat] = await orm
      .insert(chats)
      .values({
        userId: user.id!,
        contactId: contact?.id,
        usernameId: result.id,
      })
      .returning()

    chat = newChat
  }

  // #endregion

  // #region Push user message

  const userMessageTime = now()
  const history = await getHistory(orm, user, username)

  history.push({
    id: history.length + 1,
    from: 'user',
    status: MessageStatus.seen,
    content: data.content,
    inReplyTo: data.inReplyTo || null,
    time: userMessageTime.getTime(),
  })

  // #endregion

  // #region Generate bot message

  const datetime = new Date(userMessageTime).toLocaleString('en-US', {
    timeZone: 'America/Sao_Paulo',
    hour12: false,
  })

  const localization = character.characterLocalizations[0]

  const systemInstruction = `
    You are ${localization.name} (username: ${username}). 
    
    **Your description:** ${localization.description}.

    **You do not engage in any language other than English.** If the user sends a message in another language, **do not translate, interpret, or respond in that language.** Instead, inform them that you only are going to chat in English.

    Maintain a **natural, conversational tone** with concise and engaging responses. Avoid long-winded explanations—keep it chat-like.

    **Respond in markdown if necessary but prioritize plain text.**

    **Current time:** ${datetime}.

    ## Instructions

    ${localization.instructions}
  `

  const geminiHistory = chatHistoryToGemini(history)
  const botMessageContent = await sendGeminiTextInTextOut({
    apiKey: GEMINI_API_KEY,
    model: GEMINI_MODEL,
    systemInstruction,
    history: geminiHistory,
  })

  const botMessageTime = now()

  // #endregion

  // #endregion

  // #region Insert messages

  const userMessage: MessageInsert = {
    chatId: chat.id,
    content: data.content,
    inReplyToId: data.inReplyTo?.id,
    isBot: false,
    status: MessageStatus.seen,
  }

  const botMessagePayload: MessageInsert = {
    chatId: chat.id,
    content: botMessageContent,
    isBot: true,
    status: MessageStatus.seen,
  }

  const [_, botMessageRecord] = await orm
    .insert(messages)
    .values([
      userMessage,
      botMessagePayload,
    ]).returning()

  // #endregion

  // #region Insert or update last message

  const lastMessage = await orm.query.lastMessages.findFirst({
    where: eq(messages.chatId, chat.id),
  })

  const hasLastMessage = !!lastMessage

  if (hasLastMessage) {
    await orm.update(lastMessages).set({
      content: botMessageContent,
      datetime: new Date(botMessageTime),
      updatedAt: now(),
      status: MessageStatus.seen,
    }).where(eq(lastMessages.chatId, chat.id))
  }
  else {
    await orm.insert(lastMessages).values({
      chatId: chat.id,
      content: botMessageContent,
      datetime: new Date(botMessageTime),
      status: MessageStatus.seen,
    })
  }

  // #region Push bot message

  history.push(
    {
      id: botMessageRecord.id,
      from: 'bot',
      status: MessageStatus.seen,
      content: botMessageContent,
      time: botMessageTime.getTime(),
      inReplyTo: null,
    },
  )

  // #endregion

  return history
})
