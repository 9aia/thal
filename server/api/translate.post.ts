import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { getHistory } from '../services/messages'
import { promptGeminiText } from '~~/server/utils/gemini'
import { getValidated } from '~~/server/utils/h3'
import { forbidden, internal, paymentRequired, rateLimit, unauthorized } from '~~/server/utils/nuxt'
import { characterLocalizations, messages, usernames } from '~~/server/db/schema'
import { canUseAIFeatures } from '~~/shared/utils/plan'

export default defineEventHandler(async (event) => {
  const { GCP_GEMINI_API_KEY, GEMINI_MODEL } = useRuntimeConfig(event)

  if (!GCP_GEMINI_API_KEY)
    throw internal('GCP_GEMINI_API_KEY is not set in the environment')

  if (!GEMINI_MODEL)
    throw internal('GEMINI_MODEL is not set in the environment')

  const data = await getValidated(event, 'body', z.object({
    messageText: z.string(),
    messageIsBot: z.boolean().default(false).describe('isBotMessage is used to identify if the message is from the bot'),
    chatUsername: z.string().describe('The chatUsername is required for context'),
    toNative: z.boolean().default(true).describe('Should translate to native language'),
    replyMessageId: z.number().optional().describe('The replyMessageId is the id of the reply message'),
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

  const username = await orm.query.usernames.findFirst({
    where: eq(usernames.text, data.chatUsername!),
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
            where: eq(characterLocalizations.locale, 'en-US'),
          },
        },
      },
    },
  })

  if (!username)
    throw forbidden('Username not found')

  const localization = username.character?.characterLocalizations?.[0]

  if (username.character && !username.character.deletedAt && !localization) {
    throw internal('Character localization not found')
  }

  const history = await getHistory(orm, user, data.chatUsername!)

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

  if (data.replyMessageId) {
    const replyMessageData = await orm.query.messages.findFirst({
      where: eq(messages.id, data.replyMessageId),
    })

    if (replyMessageData) {
      const sender = replyMessageData.isBot ? 'Bot: ' : 'User: '
      replyMessage = sender + replyMessageData.content
    }
  }

  const learningLocale = 'en-US'
  const nativeLocale = 'pt-BR'

  const toLocale = data.toNative ? nativeLocale : learningLocale
  const fromLocale = data.toNative ? learningLocale : nativeLocale

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

  const systemInstruction = `You are a message translation assistant for a language learning app. 
    Your task is to translate input from ${fromLocale === 'en-US' ? 'English' : 'Portuguese'} to ${toLocale === 'pt-BR' ? 'Portuguese' : 'English'} with high accuracy and context awareness.

    [Translation Instructions]
    - Translate ONLY the message content.
    - Use context from <conversation-history> and <replying> (if present).
    - Maintain tone, intent, and meaning.
    - The output must be in ${toLocale === 'pt-BR' ? 'Portuguese' : 'English'}.
    - Do NOT include explanations, summaries, or additional comments.
    - Do NOT translate the reply message in <replying>.
    - Fix grammar/spelling only if it clarifies the meaning.
    - Do NOT add or remove information.

    [Personalization Guidelines]
    - Use <user-data> and <bot-data> to personalize translation (e.g. pronouns, gender agreement, names).
    - Reflect user’s communication style where possible.

    <context>
      <user-data>
        ${JSON.stringify({
          name: user.name,
          lastName: user.lastName,
          username: user.username,
        }, null, 2)}
        })}
      </user-data>

      ${character
        ? `
          <bot-data>
            ${character.name} (@${data.chatUsername}) 

            ${character.description}
          </bot-data>
      `
        : ''}

      ${historyContext}
    </context>
  `

  const prompt = `
    ${replyMessageFormatted}

    ${data.messageIsBot ? 'Bot: ' : 'User: '} ${data.messageText}
  `

  const text = await promptGeminiText({
    model: GEMINI_MODEL,
    apiKey: GCP_GEMINI_API_KEY,
    prompt,
    systemInstruction,
  })

  if (!text)
    throw internal('Gemini did not return a valid translation')

  return {
    translation: text,
  }
})
