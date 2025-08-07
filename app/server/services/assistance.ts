import type { ResponseSchema } from '@google/generative-ai'
import { SchemaType } from '@google/generative-ai'
import { and, eq, isNull } from 'drizzle-orm'
import type { H3Event } from 'h3'
import { getHistory } from './messages'
import type { MessageCorrectionData } from '~/types'
import { now } from '~/utils/date'
import { promptGeminiJson } from '~/utils/gemini'
import { forbidden, internal, notFound, paymentRequired, rateLimit, unauthorized } from '~/utils/nuxt'
import { canUseAIFeatures } from '~/utils/plan'
import { characterLocalizations, correctedMessages, messages } from '~~/db/schema'

interface CorrectMessageOptions {
  messageId: number
  toNative?: boolean
}

export async function correctMessage(event: H3Event, { messageId }: CorrectMessageOptions) {
  const { GCP_GEMINI_API_KEY, GEMINI_MODEL } = useRuntimeConfig(event)

  if (!GCP_GEMINI_API_KEY)
    throw internal('GCP_GEMINI_API_KEY is not set in the environment')

  if (!GEMINI_MODEL)
    throw internal('GEMINI_MODEL is not set in the environment')

  const user = event.context.user
  const orm = event.context.orm

  if (!user)
    throw unauthorized()

  if (!canUseAIFeatures(user))
    throw paymentRequired()

  const correctionRateLimit = await event.context.cloudflare.env.CORRECTION_RATE_LIMIT.limit({ key: `correction-${user.id}` })

  if (!correctionRateLimit.success)
    throw rateLimit()

  const message = await orm.query.messages.findFirst({
    where: and(
      eq(messages.id, messageId),
      isNull(messages.deletedAt),
    ),
    with: {
      chat: {
        columns: {
          id: true,
          userId: true,
        },
        with: {
          username: {
            columns: {
              text: true,
            },
            with: {
              character: {
                columns: {
                  discoverable: true,
                  deletedAt: true,
                },
                with: {
                  characterLocalizations: {
                    columns: {
                      name: true,
                      description: true,
                    },
                    where: and(
                      isNull(characterLocalizations.deletedAt),
                      eq(characterLocalizations.locale, 'en-US'),
                    ),
                  },
                },
              },
            },
          },
        },
      },
      inReplyTo: {
        columns: {
          id: true,
          content: true,
          isBot: true,
        },
      },
    },
    columns: {
      content: true,
      isBot: true,
    },
  })

  if (!message)
    throw notFound('Message not found')

  if (!message.chat.id)
    throw notFound('Chat not found')

  if (message.chat.userId !== user.id)
    throw forbidden('You do not have permission to access this message')

  const username = message.chat.username

  if (!username)
    throw forbidden('Username not found')

  const localization = username.character?.characterLocalizations?.[0]

  if (username.character && !username.character.deletedAt && !localization) {
    throw internal('Character localization not found')
  }

  const history = await getHistory(orm, user, username.text)

  const formattedHistory = history.map((message) => {
    if (message.from === 'user') {
      return `Character 1: ${message.content}`
    }
    return `Character 2: ${message.content}`
  }).join('\n')

  const character = username.character && !username.character.deletedAt && localization
    ? {
        username: username.text,
        discoverable: username.character.discoverable,
        name: localization.name,
        description: localization.description,
      }
    : null

  let replyMessage = ''

  if (message.inReplyTo?.id) {
    const sender = message.inReplyTo.isBot ? 'Bot: ' : 'User: '
    replyMessage = sender + message.inReplyTo.content
  }

  const replyMessageFormatted = replyMessage
    ? `<replying>
      ${replyMessage}
    </replying>`
    : ''

  const historyContext = history.length
    ? `<conversation-history>
    ${formattedHistory}
    </conversation-history>`
    : ``

  const systemInstruction = `
    You are a text correction assistant for a language learning app.
    Your task is to correct the message of the user with high accuracy and context awareness.
    The user is learning English and is a native Portuguese speaker.

    [Analysis Instructions]
    - Use context from <conversation-history> and <replying> (if present).
    - Maintain intent and meaning.
    - Do not include explanations or justifications in the response, only correct the user message if applicable or any mistakes were made.
    - Pay attention to suttle mistakes, be very precise, accurate and rigorous.
    - Consider common mistakes that users make, like spelling, grammar, punctuation, etc.

    [Personalization Guidelines]
    - Use <user-data> and <bot-data> to improve the correction (e.g. pronouns, gender agreement, names).
    - Reflect user’s communication style where possible or applicable.

    <context>
      <user-data>
        ${JSON.stringify({
          name: user.name,
          lastName: user.lastName,
          username: user.username,
        }, null, 2)}
      </user-data>

      ${character
        ? `
          <bot-data>
            ${character.name} (@${message.chat.username.text}): 

            ${character.description}
          </bot-data>
      `
        : ''}

      ${historyContext}
    </context>
  `

  const prompt = `
    ${replyMessageFormatted}

    ${message.isBot ? 'Bot: ' : 'User: '} ${message.content}
  `

  const responseSchema: ResponseSchema = {
    type: SchemaType.OBJECT,
    description: 'An object for analyzing and correcting a user\'s message.',
    properties: {
      status: {
        type: SchemaType.STRING,
        description: 'Indicates whether the message is correct (\'ok\') or needs correction (\'needs_correction\').',
        enum: ['ok', 'needs_correction'],
      },
      severity: {
        type: SchemaType.STRING,
        description: `
          A string indicating the severity of the errors found, provided only if the status is 'needs_correction'.

          - **minor**: The error is small and doesn't hinder understanding (e.g., a capitalization issue, a missing comma, or a simple typo). For instance: 'i' instead of 'I', 'hte' instead of 'the', or a missing period.
          - **moderate**: The error is noticeable and might make the text sound unnatural or slightly confusing (e.g., incorrect verb tense or a singular/plural mismatch). For instance: incorrect verb tense like 'he go' instead of 'he goes', or a plural/singular mismatch like 'a cats'.
          - **major**: The error is significant, making the message difficult to understand or grammatically incorrect. This includes clear syntactical errors, severe spelling mistakes, or jumbled sentence structures. For instance: a missing verb like 'He to the store', a severe spelling error that makes a key word unrecognizable, or a jumbled sentence like 'to want work you?'.
        `,
        enum: ['minor', 'moderate', 'major'],
        example: 'minor',
      },
      correctedMessage: {
        type: SchemaType.STRING,
        description: 'The corrected version of the user\'s message, provided only if the status is \'needs_correction\'.',
        example: 'John is responsible.',
      },
    },
    required: ['status'],
  }

  const data = await promptGeminiJson<MessageCorrectionData>({
    model: GEMINI_MODEL,
    apiKey: GCP_GEMINI_API_KEY,
    responseSchema,
    prompt,
    systemInstruction,
  })

  console.log(data)

  if (!data)
    throw internal('Gemini did not return a valid translation')

  const [createdMessageCorrection] = await orm.insert(correctedMessages).values({
    messageId,
    content: data.correctedMessage,
    severity: data.severity,
    createdAt: now(),
  }).returning()

  return createdMessageCorrection
}
