import { and, eq, isNull } from 'drizzle-orm'
import { z } from 'zod'
import { correctMessage } from '~/server/services/assistance'
import { getHistory } from '~/server/services/messages'
import { now } from '~/utils/date'
import { chatHistoryToGemini, sendGeminiTextInTextOut } from '~/utils/gemini'
import { getValidated } from '~/utils/h3'
import { internal, notFound, paymentRequired, rateLimit, unauthorized } from '~/utils/nuxt'
import { canUseAIFeatures } from '~/utils/plan'
import type { MessageInsert } from '~~/db/schema'
import { MessageStatus, characterLocalizations, chats, contacts, lastMessages, messageSchema, messages, usernameSchema, usernames } from '~~/db/schema'

export default eventHandler(async (event) => {
  const { GCP_GEMINI_API_KEY, GEMINI_MODEL } = useRuntimeConfig(event)

  if (!GCP_GEMINI_API_KEY)
    throw internal('GCP_GEMINI_API_KEY is not set in the environment')

  if (!GEMINI_MODEL)
    throw internal('GEMINI_MODEL is not set in the environment')

  const { username } = await getValidated(event, 'params', z.object({ username: usernameSchema }))
  const data = await getValidated(event, 'body', messageSchema)

  const user = event.context.user

  if (!user)
    throw unauthorized()

  if (!canUseAIFeatures(user))
    throw paymentRequired()

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
        columns: {
          deletedAt: true,
        },
        with: {
          characterLocalizations: {
            columns: {
              name: true,
              description: true,
              instructions: true,
            },
            where: and(
              eq(characterLocalizations.locale, 'en-US'),
              isNull(characterLocalizations.deletedAt),
            ),
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

  if (character.deletedAt)
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

  const inReplyTo = data.inReplyTo
    ? { ...data.inReplyTo, status: MessageStatus.seen }
    : null

  const content = data.content

  history.push({
    id: history.length + 1,
    from: 'user',
    correctedMessage: [],
    status: MessageStatus.seen,
    content,
    inReplyTo,
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
    You are ${localization.name}.
    
    **Username:** ${username}.
    **Current time:** ${datetime}.
    **Your description:** ${localization.description}.

    ## System instructions for you
    
    - You MUST generate bite-sized text messages that looks like a human-human chat, please avoid long-winded explanations.
    - **You do not engage in any language other than English.** If the user sends a message in another language, **do not translate, interpret, or respond in that language.** Instead, inform them that you only are going to chat in English.
    - Maintain a **natural, conversational tone** with concise and engaging responses.
    - Avoid long-winded explanations — keep it chat-like
    - **Respond in markdown if necessary but prioritize plain text.**
    - **Don't consider knowledge outside of the instructions or the typical knowledge of the character, such as period knowledge (if the character is from the 1900s, don't consider knowledge from the 2000s).**
    - If you don't know the answer, say you don't know unless the it matches with the character traits.

    ## Post-curated user-created instructions for you

    ${localization.instructions}
  `

  const geminiHistory = chatHistoryToGemini(history)
  const botMessageContent = await sendGeminiTextInTextOut({
    apiKey: GCP_GEMINI_API_KEY,
    model: GEMINI_MODEL,
    systemInstruction,
    history: geminiHistory,
  })

  const botMessageTime = now()

  // #endregion

  // #region Insert messages

  const userMessage: MessageInsert = {
    chatId: chat.id,
    content,
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

  const [userMessageRecord, botMessageRecord] = await orm
    .insert(messages)
    .values([
      userMessage,
      botMessagePayload,
    ]).returning()

  // #endregion

  // #region Correct user message

  const userMessageCorrection = await correctMessage(event, {
    messageId: userMessageRecord.id,
  })

  history[history.length - 1]!.correctedMessage = [
    {
      id: userMessageCorrection.id,
      content: userMessageCorrection.content,
      severity: userMessageCorrection.severity,
    },
  ]

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

  // #endregion

  // #region Push bot message

  history.push(
    {
      id: botMessageRecord.id,
      from: 'bot',
      correctedMessage: [],
      status: MessageStatus.seen,
      content: botMessageContent,
      time: botMessageTime.getTime(),
      inReplyTo: null,
    },
  )

  // #endregion

  return history
})
