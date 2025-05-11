import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { getHistory } from '../services/messages'
import { getValidated } from '~/utils/h3'
import { internal, notFound, notImplemented, paymentRequired, rateLimit, unauthorized } from '~/utils/nuxt'
import { SubscriptionStatus, characterLocalizations, characterUsernames, messages } from '~~/db/schema'
import { promptGeminiText } from '~/utils/gemini'

export default defineEventHandler(async (event) => {
  const { GEMINI_API_KEY, GEMINI_MODEL } = useRuntimeConfig(event)

  if (!GEMINI_API_KEY)
    throw internal('GEMINI_API_KEY is not set in the environment')

  if (!GEMINI_MODEL)
    throw internal('GEMINI_MODEL is not set in the environment')

  const user = event.context.user
  const orm = event.context.orm

  if (!user)
    throw unauthorized()

  if (user.subscriptionStatus === SubscriptionStatus.past_due) {
    throw paymentRequired()
  }

  const translateRateLimit = await event.context.cloudflare.env.TRANSLATE_RATE_LIMIT.limit({ key: `translate-${user.id}` })

  if (!translateRateLimit.success)
    throw rateLimit()

  const data = await getValidated(event, 'body', z.object({
    messageText: z.string(),
    messageIsBot: z.boolean().default(false).describe('isBotMessage is used to identify if the message is from the bot'),
    chatUsername: z.string().describe('The chatUsername is required for context'),
    toNative: z.boolean().default(true).describe('Should translate to native language'),
    replyMessageId: z.number().optional().describe('The replyMessageId is the id of the reply message'),
  }))

  const characterUsername = await orm.query.characterUsernames.findFirst({
    where: eq(characterUsernames.username, data.chatUsername!),
    with: {
      character: {
        columns: {
          discoverable: true,
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

  if (!characterUsername)
    throw notFound('Character Username not found')

  if (!characterUsername.character)
    throw notImplemented('Character not found')

  if (!characterUsername.character.characterLocalizations
    || !characterUsername.character.characterLocalizations[0]
  ) {
    throw internal('Character localization not found')
  }

  const { history } = await getHistory(orm, user, data.chatUsername!)

  const formattedHistory = history.map((message) => {
    if (message.from === 'user') {
      return `Character 1: ${message.message}`
    }
    return `Character 2: ${message.message}`
  }).join('\n')

  const localization = characterUsername.character.characterLocalizations[0]

  const character = {
    username: characterUsername.username,
    discoverable: characterUsername.character.discoverable,
    name: localization.name,
    description: localization.description,
  }

  let replyMessage = ''

  if (data.replyMessageId) {
    const replyMessageData = await orm.query.messages.findFirst({
      where: eq(messages.id, data.replyMessageId),
    })

    if (replyMessageData) {
      const sender = replyMessageData.isBot ? 'Bot: ' : 'User: '
      replyMessage = replyMessageData.data.type === 'text' ? sender + replyMessageData.data.value : ''
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
          pronouns: user.pronouns,
          username: user.username,
        }, null, 2)}
        })}
      </user-data>

      <bot-data>
        ${character.name} (@${data.chatUsername}) 

        ${character.description}
      </bot-data>

      ${historyContext}
    </context>
  `

  const prompt = `
    ${replyMessageFormatted}

    ${data.messageIsBot ? 'Bot: ' : 'User: '} ${data.messageText}
  `

  const text = await promptGeminiText({
    model: GEMINI_MODEL,
    apiKey: GEMINI_API_KEY,
    prompt,
    systemInstruction,
  })

  if (!text)
    throw internal('Gemini did not return a valid translation')

  return {
    translation: text,
  }
})
