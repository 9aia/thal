import { and, eq, isNull } from 'drizzle-orm'
import { z } from 'zod'
import { getHistory } from '~/server/services/messages'
import { now } from '~/utils/date'
import { promptGeminiText } from '~/utils/gemini'
import { getValidated } from '~/utils/h3'
import { badRequest, forbidden, internal, notFound, paymentRequired, rateLimit, unauthorized } from '~/utils/nuxt'
import { canUseAIFeatures } from '~/utils/plan'
import { numericString } from '~/utils/zod'
import { characterLocalizations, correctedMessages, localeSchema, messageAnalysisSummaries, messages } from '~~/db/schema'

export default defineEventHandler(async (event) => {
  const { messageId } = await getValidated(event, 'params', z.object({
    messageId: numericString(z.number().int().positive()),
  }))
  const { locale } = await getValidated(event, 'query', z.object({
    locale: localeSchema,
  }))

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

  const analysisSummaryRateLimit = await event.context.cloudflare.env.ANALYSIS_SUMMARY_RATE_LIMIT.limit({ key: `analysis-summary-${user.id}` })

  if (!analysisSummaryRateLimit.success)
    throw rateLimit()

  const message = await orm.query.messages.findFirst({
    where: and(
      eq(messages.id, messageId),
      isNull(messages.deletedAt),
    ),
    with: {
      correctedMessage: {
        columns: {
          content: true,
        },
        where: isNull(correctedMessages.ignoredAt),
      },
      messageAnalysisSummaries: {
        columns: {
          content: true,
          id: true,
        },
      },
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

  if (message.isBot)
    throw badRequest('Message is from a bot, not a user')

  if (message.chat.userId !== user.id)
    throw forbidden('You do not have permission to access this message')

  const username = message.chat.username

  if (!username)
    throw forbidden('Username not found')

  const localization = username.character?.characterLocalizations?.[0]

  if (username.character && !username.character.deletedAt && !localization) {
    throw internal('Character localization not found')
  }

  if (!message.correctedMessage) {
    badRequest('Message does not have a corrected message')
  }

  if (message?.messageAnalysisSummaries?.length) {
    const analysisSummary = message.messageAnalysisSummaries[0]

    if (analysisSummary.content)
      return analysisSummary
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
    You are a message analysis assistant for a language learning app.
    Your task is to analyze the message of the user and provide feedback about it with high accuracy and context awareness.
    The user is learning English and is a native Portuguese speaker.

    [Analysis Instructions]
    - Use context from <conversation-history> and <replying> (if present).
    - Maintain tone, intent, and meaning.
    - Do not include explanations or justifications in the response, only include the should-do and should-not-do feedback.
    - The feedback texts must be in ${locale === 'pt-BR' ? 'Portuguese' : 'English'}.
    - Be very succinct and concise in your feedback.
    - Include a summary or additional comment of the mistake.

    [Personalization Guidelines]
    - Use <user-data> and <bot-data> to personalize analysis (e.g. pronouns, gender agreement, names).
    - Reflect user’s communication style where possible.

    [Suggested Corrected Message]
    ${message.correctedMessage?.[0]?.content}

    [Output Example]
    ${locale === 'pt-BR'
      ? 'Não use "fantasy" para traduzir "fantasia". O termo correto é "costume". O significado de "fantasy" é diferente e pode causar confusão.'
      : 'Do not use "fantasy" to translate "fantasia". The correct term is "costume". The meaning of "fantasy" is different and can cause confusion.'}

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

    ${'User: '} ${message.content}
  `

  const data = await promptGeminiText({
    model: GEMINI_MODEL,
    apiKey: GCP_GEMINI_API_KEY,
    prompt,
    systemInstruction,
  })

  if (!data)
    throw internal('Gemini did not return a valid translation')

  const [createdMessageAnalysis] = await orm.insert(messageAnalysisSummaries).values({
    content: data,
    messageId,
    createdAt: now(),
  }).returning()

  return createdMessageAnalysis
})
