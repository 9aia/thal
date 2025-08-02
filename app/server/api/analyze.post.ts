import type { ResponseSchema } from '@google/generative-ai'
import { SchemaType } from '@google/generative-ai'
import { and, eq, isNull } from 'drizzle-orm'
import { z } from 'zod'
import { getHistory } from '~/server/services/messages'
import type { MessageAnalysis } from '~/types'
import { now } from '~/utils/date'
import { promptGeminiJson } from '~/utils/gemini'
import { getValidated } from '~/utils/h3'
import { forbidden, internal, notFound, paymentRequired, rateLimit, unauthorized } from '~/utils/nuxt'
import { canUseAIFeatures } from '~/utils/plan'
import { characterLocalizations, messageAnalyses, messages } from '~~/db/schema'

export default defineEventHandler(async (event) => {
  const { GCP_GEMINI_API_KEY, GEMINI_MODEL } = useRuntimeConfig(event)

  if (!GCP_GEMINI_API_KEY)
    throw internal('GCP_GEMINI_API_KEY is not set in the environment')

  if (!GEMINI_MODEL)
    throw internal('GEMINI_MODEL is not set in the environment')

  const { messageId, toNative } = await getValidated(event, 'body', z.object({
    messageId: z.number(),
    toNative: z.boolean().default(true).describe('Should translate to native language'),
  }))

  const user = event.context.user
  const orm = event.context.orm

  if (!user)
    throw unauthorized()

  if (!canUseAIFeatures(user))
    throw paymentRequired()

  const translateRateLimit = await event.context.cloudflare.env.TRANSLATE_RATE_LIMIT.limit({ key: `translate-${user.id}` })

  if (!translateRateLimit.success)
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

  if (message.chat.userId !== user.id)
    throw forbidden('You do not have permission to access this message')

  const username = message.chat.username

  if (!username)
    throw forbidden('Username not found')

  const localization = username.character?.characterLocalizations?.[0]

  if (username.character && !username.character.deletedAt && !localization) {
    throw internal('Character localization not found')
  }

  const history = await getHistory(orm, user, username.text!)

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

  const learningLocale = 'en-US'
  const nativeLocale = 'pt-BR'

  const toLocale = toNative ? nativeLocale : learningLocale

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
    You are a message analysis assistant for a language learning app.
    Your task is to analyze the message of the user and provide feedback about it with high accuracy and context awareness.
    The user is learning English and is a native Portuguese speaker.

    [Analysis Instructions]
    - Use context from <conversation-history> and <replying> (if present).
    - Maintain tone, intent, and meaning.
    - Do not include explanations or justifications in the response, only include the should-do and should-not-do feedback.
    - The feedback texts must be in ${toLocale === 'pt-BR' ? 'Portuguese' : 'English'}.
    - Be very succinct and concise in your feedback.

    [Personalization Guidelines]
    - Use <user-data> and <bot-data> to personalize analysis (e.g. pronouns, gender agreement, names).
    - Reflect user’s communication style where possible.

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
    type: SchemaType.ARRAY,
    items: {
      type: SchemaType.OBJECT,
      properties: {
        status: {
          type: SchemaType.STRING,
          enum: ['error', 'warning'],
          description: `
            The status of the analysis.

            - **error**: Indicates a critical mistake that needs to be corrected, for example grammatical errors, spelling mistakes, etc.
            - **warning**: Indicates a mistake that should be noted but does not require immediate correction, for example incorrect punctuation or word choice.
          `,
          example: 'warning',
        },
        text: {
          type: SchemaType.STRING,
          description: `
            Include a summary or additional comment of the mistake.
          `,
          example: 'Não use "fantasy" para traduzir "fantasia". O termo correto é "costume". O significado de "fantasy" é diferente e pode causar confusão.',
        },
      },
      required: ['status', 'text'],
    },
  }

  const data = await promptGeminiJson<MessageAnalysis>({
    model: GEMINI_MODEL,
    apiKey: GCP_GEMINI_API_KEY,
    responseSchema,
    prompt,
    systemInstruction,
  })

  if (!data)
    throw internal('Gemini did not return a valid translation')

  const [createdMessageAnalysis] = await orm.insert(messageAnalyses).values({
    data,
    createdAt: now(),
  }).returning()

  await orm.update(messages).set({
    analysisId: createdMessageAnalysis.id,
  }).where(eq(messages.id, messageId))

  return data
})
