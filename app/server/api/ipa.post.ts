import { z } from 'zod'

import { getGemini } from '~/utils/gemini'
import { getValidated } from '~/utils/h3'
import { internal, paymentRequired, unauthorized } from '~/utils/nuxt'
import { SubscriptionStatus } from '~~/db/schema'

export default eventHandler(async (event) => {
  const { GEMINI_API_KEY } = useRuntimeConfig(event)

  if (!GEMINI_API_KEY)
    throw internal('GEMINI_API_KEY is not set in the environment')

  const user = event.context.user

  if (!user)
    throw unauthorized()

  if (user.subscriptionStatus === SubscriptionStatus.past_due) {
    throw paymentRequired()
  }

  const data = await getValidated(event, 'body', z.object({
    text: z.string().min(1).max(300),
  }))

  const prompt = `
    Give me the General American IPA for the text: ${data.text}

    ## Output Criteria

    - Your output should be a complete valid JSON.
    - The output should follow exactly the format in the example below;

    ## Output Example

    {
      "transcript": "/kæt/" 
    }
  `

  const gemini = getGemini(GEMINI_API_KEY as string)

  const res = await gemini.generateContent(prompt)
  const bestCandidate = res.candidates?.[0]
  const bestPart = bestCandidate?.content?.parts?.[0]
  const text: string = bestPart?.text

  if (!text)
    throw internal('Gemini did not return a valid translation')

  let json: { transcript: string }

  try {
    json = JSON.parse(text)

    if (!json.transcript)
      throw internal()
  }
  catch (e) {
    const _ = e
    throw internal('Gemini generated an invalid output.')
  }

  return json
})
