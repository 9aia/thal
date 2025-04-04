import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { getHistory } from '../services/messages'
import { getValidated } from '~/utils/h3'
import { internal, paymentRequired, unauthorized } from '~/utils/nuxt'
import { SubscriptionStatus, characterUsernames, messages } from '~~/db/schema'
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
    chatUsername: z.string().optional().describe('The chatUsername is required for context'),
    toNative: z.boolean().default(true).describe('Should translate to native language'),
    replyMessageId: z.number().optional().describe('The replyMessageId is the id of the reply message'),
  }))

  const hasContext = !!data.chatUsername

  let context = null
  let character = null
  let replyMessage = ''

  if (hasContext) {
    const { history } = await getHistory(orm, user, data.chatUsername!)

    context = history.map(message => message.message).join(' ').trim()

    const characterUsername = await orm.query.characterUsernames.findFirst({
      where: eq(characterUsernames.username, data.chatUsername!),
      with: {
        character: true,
      },
    })

    if (characterUsername?.character) {
      character = {
        name: characterUsername.character.name,
        username: characterUsername.username,
        description: characterUsername.character.description,
        discoverable: characterUsername.character.discoverable,
      }
    }

    if (data.replyMessageId) {
      const replyMessageData = await orm.query.messages.findFirst({
        where: eq(messages.id, data.replyMessageId),
      })

      if (replyMessageData) {
        replyMessage = replyMessageData.data.type === 'text' ? replyMessageData.data.value : ''
      }
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

  const systemInstruction = hasContext
    ? `You are an AI tool specialized in translating messages that the user is about to send.

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
    ${character?.name} (@${data.chatUsername}) 

    ${character?.description}

    [Chat history]
    ${context}

    ${replyMessageFormatted}
    `
    : `You are an AI tool specialized in translating messages that the user is about to send.
    
    [Output instructions]
    - Be accurate and context-aware.
    - Keep the original tone.
    - Keep plain text.
    - Do not add or remove information.
    - The output message should be in ${toLocale}.
    - No further explanation or comments are needed.

    [Character the user is interacting with]
    ${character?.name} (@${data.chatUsername}) 

    ${character?.description}

    [Chat history]
    ${context}

    ${replyMessageFormatted}
    `

  const prompt = hasContext
    ? `[Message to Translate]
    ${data.text}
  `
    : data.text

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
