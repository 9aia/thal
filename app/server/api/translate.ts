import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { getHistory } from '../services/messages'
import { getValidated } from '~/utils/h3'
import { badRequest, internal, notFound, notImplemented, paymentRequired, unauthorized } from '~/utils/nuxt'
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

  const data = await getValidated(event, 'body', z.object({
    text: z.string(),
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

  const context = history.map(message => message.message).join(' ').trim()

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
      replyMessage = replyMessageData.data.type === 'text' ? replyMessageData.data.value : ''
    }
  }

  const learningLocale = 'en-US'
  const nativeLocale = 'pt-BR'

  const toLocale = data.toNative ? nativeLocale : learningLocale
  const fromLocale = data.toNative ? learningLocale : nativeLocale

  const replyMessageFormatted = replyMessage
    ? `[Message user are replying to]
    ${replyMessage}`
    : ''

  const systemInstruction = `You are an AI tool specialized in translating messages that the user is about to send.

    [Input details]
    - The message can include text in ${fromLocale} and ${toLocale}. 
    
    [Output instructions]
    - Be accurate and context-aware.
    - Keep the original tone.
    - Do not add or remove information.
    - The output message should be in ${toLocale}.
    - Fix grammar/orthography errors if necessary.
    - No further explanation or comments are needed.

    [Character the user is interacting with]
    ${character.name} (@${data.chatUsername}) 

    ${character.description}

    [Chat history]
    ${context}

    ${replyMessageFormatted}
  `

  const prompt = `[Message to Translate]
    ${data.text}
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
