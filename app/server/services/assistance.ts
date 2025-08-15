import type { ResponseSchema } from '@google/generative-ai'
import { SchemaType } from '@google/generative-ai'
import { and, eq, isNull } from 'drizzle-orm'
import type { H3Event, H3EventContext } from 'h3'
import { getHistory } from './messages'
import type { MessageCorrectionData } from '~/types'
import { now } from '~/utils/date'
import { promptGeminiJson, promptGeminiText } from '~/utils/gemini'
import { badRequest, forbidden, internal, notFound, paymentRequired, rateLimit, unauthorized } from '~/utils/nuxt'
import { canUseAIFeatures } from '~/utils/plan'
import type { LocaleSchemaType, User } from '~~/db/schema'
import { characterLocalizations, correctedMessages, messageAnalysisExplanations, messages } from '~~/db/schema'

interface CorrectMessageOptions {
  messageId: number
  toNative?: boolean
  regenerate?: boolean
}

export async function correctMessage(event: H3Event, { messageId, regenerate }: CorrectMessageOptions) {
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
      return `User: ${message.content}`
    }
    return `Bot: ${message.content}`
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

  const userData = `
    <user-data>
      ${JSON.stringify({
        name: user.name,
        lastName: user.lastName,
        username: user.username,
      }, null, 2)}
    </user-data>
  `
  const characterData = character
    ? `
      <bot-data>
        ${character.name} (@${message.chat.username.text}): 

        ${character.description}
      </bot-data>
    `
    : ''

  const systemInstruction = `
    You are an English correction assistant inside a language learning app where users learn English through chats with simulated characters. Your task is to identify and correct common English mistakes made by native Brazilian Portuguese speakers with high accuracy and context awareness. Analyze the following text message in the user prompt and provide a corrected version if applicable. 

    [Instructions]
    - Pay attention to subtle mistakes, be very precise, accurate and rigorous.
    - Consider the user's communication style where possible or applicable.
    - Consider the <conversation-history> and <replying> (if present).
    - Maintain intent and meaning.
    - Use <user-data> and <bot-data> to improve the correction (e.g. pronouns, gender agreement, names).
    - Focus on grammatical errors (such as verb tense, article usage, and word order), vocabulary issues (especially false cognates), and typical phrasing that results from a direct translation (especially slangs, idioms or coloquialisms).
    - Consider slangs, idioms or coloquialisms that are common in English that could be used for much more natural-sounding English instead of the literal translation user might be using.
    - Consider also socio-linguistic mistakes, especially missing politeness.
    - Avoid adding contractions to the corrected message unless it's necessary, e.g. the user is quoting inside its message for a natural-sounding English character.
    
    [Context]

    ${userData}
    
    ${characterData}

    ${historyContext}
  `

  const prompt = `
    ${replyMessageFormatted}

    User: ${message.content}
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

  if (!data)
    throw internal('Gemini did not return a valid translation')

  if (regenerate) {
    await orm.update(correctedMessages).set({
      regeneratedAt: now(),
    }).where(and(
      eq(correctedMessages.messageId, messageId),
      isNull(correctedMessages.regeneratedAt),
    ))
  }

  const [createdMessageCorrection] = await orm.insert(correctedMessages).values({
    messageId,
    content: data.correctedMessage || null,
    severity: data.severity || null,
    createdAt: now(),
  }).returning()

  return createdMessageCorrection
}

interface ExplainCorrectedMessageOptions {
  messageId: number
  messageContent: string
  correctedMessageContent: string | null
  username: any
  inReplyTo: any
  regenerate?: boolean
}

export async function explainCorrectedMessage(
  event: H3Event,
  orm: H3EventContext['orm'],
  user: User,
  locale: LocaleSchemaType,
  {
    messageId,
    messageContent,
    correctedMessageContent,
    username,
    inReplyTo,
    regenerate,
  }: ExplainCorrectedMessageOptions,
) {
  const { GCP_GEMINI_API_KEY, GEMINI_MODEL } = useRuntimeConfig(event)

  if (!GCP_GEMINI_API_KEY)
    throw internal('GCP_GEMINI_API_KEY is not set in the environment')

  if (!GEMINI_MODEL)
    throw internal('GEMINI_MODEL is not set in the environment')

  if (!correctedMessageContent)
    throw badRequest('Corrected message does not exist')

  if (!username)
    throw forbidden('Username not found')

  const localization = username.character?.characterLocalizations?.[0]

  if (username.character && !username.character.deletedAt && !localization) {
    throw internal('Character localization not found')
  }

  const history = await getHistory(orm, user, username.text)

  const formattedHistory = history.map((message) => {
    if (message.from === 'user') {
      return `User: ${message.content}`
    }
    return `Bot: ${message.content}`
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

  if (inReplyTo?.id) {
    const sender = inReplyTo.isBot ? 'Bot: ' : 'User: '
    replyMessage = sender + inReplyTo.content
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

  const userData = `
  <user-data>
    ${JSON.stringify({
      name: user.name,
      lastName: user.lastName,
      username: user.username,
    }, null, 2)}
  </user-data>
`
  const characterData = character
    ? `
    <bot-data>
      ${character.name} (@${username.text}): 

      ${character.description}
    </bot-data>
  `
    : ''

  const example = locale === 'en-US'
    ? `
      You're almost there! The word "responsable" doesn't exist in English. The correct form is "responsible". 😉
    `
    : `
      Você está quase lá! A palavra "responsable" não existe em inglês. A forma correta é "responsible". 😉
    `

  const systemInstruction = `
    You are an AI language assistant specializing in providing brief, clear, accurate, and contextual feedback on English errors for a Brazilian Portuguese speaker. Your role is to act as an external observer, not as a participant in the conversation.

    [Instructions]
    - You must be very accurate and precise. Do not make up mistakes.
    - Analyze the user's message and identify the primary English mistake (grammar, vocabulary, or phrasing).
    - Provide a concise explanation for the mistake. Focus on common grammatical errors, vocabulary issues, and phrasing that comes from direct translation.
    - The explanation must be in ${locale === 'pt-BR' ? 'Portuguese' : 'English'} and should not continue the conversation.
    - Do not use any greetings (e.g., Olá, Oi, Hello).
    - Do not quote the user's message or the corrected version.
    - Adopt a friendly, supportive, and educational tone.
    - Use the provided context (<user-data>, <bot-data>, <conversation-history>, <corrected-message>, etc.) to make your feedback more relevant and personalized.

    [Output Example]
    ${example}

    [Context]

    ${userData}
    
    ${characterData}

    ${historyContext}

    <corrected-message>
      ${correctedMessageContent}
    </corrected-message>
  `

  const prompt = `
    ${replyMessageFormatted}

    User: ${messageContent}
  `

  const data = await promptGeminiText({
    model: GEMINI_MODEL,
    apiKey: GCP_GEMINI_API_KEY,
    prompt,
    systemInstruction,
  })

  if (!data)
    throw internal('Gemini did not return a valid translation')

  if (regenerate) {
    await orm.update(messageAnalysisExplanations).set({
      regeneratedAt: now(),
    }).where(eq(messageAnalysisExplanations.messageId, messageId))
  }

  const [createdMessageAnalysis] = await orm.insert(messageAnalysisExplanations).values({
    content: data,
    messageId,
    createdAt: now(),
  }).returning()

  return createdMessageAnalysis
}
