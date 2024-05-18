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

  let text

  try {
    const res = (await gemini.generateContent(prompt)) as any

    if ("error" in res)
      throw new Error(`Gemini internal error: ${res.error}`)

    if (import.meta.dev)
      console.log(JSON.stringify(res, null, 2))

    const bestCandidate = res.candidates?.[0]
    const bestPart = bestCandidate?.content?.parts?.[0]

    text = bestPart?.text
  }
  catch (_e) {
    const e = _e as Error
    throw internal(`Error while fetching Gemini API: ${e.message}`)
  }

  let json: { transcript: string }

  try {
    json = JSON.parse(text)

    if (!json.transcript)
      throw internal()
  }
  catch (e) {
    throw internal("Gemini generated an invalid output.")
  }

  return json
})
