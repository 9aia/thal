import { z } from 'zod'
import { getEnv } from '~/utils/envs'
import { getGemini } from '~/utils/gemini'
import { getValidated } from '~/utils/h3'
import { internal, unauthorized } from '~/utils/nuxt'

export default eventHandler(async (event) => {
  const { GEMINI_API_KEY } = getEnv(event)

  if (!GEMINI_API_KEY)
    throw internal('GEMINI_API_KEY is not set in the environment')

  const user = event.context.user

  if (!user)
    throw unauthorized()

  const data = await getValidated(event, 'body', z.object({
    transcript: z.string().min(1).max(300),
    expected: z.string().min(1).max(300),
  }))

  const prompt = `
    Your are expected to rate user speech based on pronounciation. You should provide a score from 0 to 10, where 0 means very far away and 10 means equal to the expected pronounciation. if the user repeats, only consider the best option.

    ## Expected Transcription

    ${data.expected}

    ## User Speech Transcription

    ${data.transcript}

    ## Output Criteria

    - Your output should be a complete valid JSON.
    - The output should follow exactly the format in the example below;

    ## Output Example

    {
      "score": 6 
    }
  `

  const gemini = getGemini(GEMINI_API_KEY as string)

  const res = await gemini.generateContent(prompt)
  const bestCandidate = res.candidates?.[0]
  const bestPart = bestCandidate?.content?.parts?.[0]
  const text: string = bestPart?.text

  if (!text)
    throw internal('Gemini did not return a valid translation')

  let json: { score: number }

  try {
    json = JSON.parse(text)

    if (!json.score)
      throw internal()
  }
  catch (e) {
    const _ = e
    throw internal('Gemini generated an invalid output.')
  }

  return json
})
