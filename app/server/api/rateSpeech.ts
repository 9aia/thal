import process from "node:process"
import { z } from "zod"
import { getGemini } from "~/utils/gemini"
import { getValidated } from "~/utils/h3"
import { internal, unauthorized } from "~/utils/nuxt"

export default eventHandler(async (event) => {
  const { GEMINI_API_KEY } = process.env

  const user = event.context.user

  if (!user)
    throw unauthorized()

  const data = await getValidated(event, "body", z.object({
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

  let text

  try {
    const res = (await gemini.generateContent(prompt)) as any

    if ("error" in res)
      throw new Error(`Gemini internal error: ${res.error}`)

    const bestCandidate = res.candidates?.[0]
    const bestPart = bestCandidate?.content?.parts?.[0]

    text = bestPart?.text
  }
  catch (e) {
    const error = e as Error

    throw internal(`Error while fetching Gemini API: ${error.message}`)
  }

  let json: { score: number }

  try {
    json = JSON.parse(text)

    if (!json.score)
      throw internal()
  }
  catch (e) {
    throw internal("Gemini generated an invalid output.")
  }

  return json
})
