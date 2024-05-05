import process from "node:process"
import { z } from "zod"
import { getGemini } from "~/src/base/utils/gemini"
import { getValidated } from "~/src/base/utils/h3"
import { internal, unauthorized } from "~/src/base/utils/nuxt"

export default defineEventHandler(async (event) => {
  const { GEMINI_API_KEY } = process.env

  const user = event.context.user

  if (!user)
    throw unauthorized()

  const data = await getValidated(event, "body", z.object({
    text: z.string().min(1).max(300),
    locale: z.string().min(2).max(5),
  }))

  const prompt = `
    You are a translator from en-US to ${data.locale}. You are expected to translate the text (Input).

    ## Input

    ${data.text}

    ## Output Criteria

    - Your output should be a complete plain text.

    ## Output Format

    Suas compras somam $24.
  `

  const gemini = getGemini(GEMINI_API_KEY as string)

  let text: string

  try {
    const res = (await gemini.generateContent(prompt)) as any

    if ("error" in res)
      throw new Error(`Gemini internal error: ${res.error}`)

    const bestCandidate = res.candidates?.[0]
    const bestPart = bestCandidate?.content?.parts?.[0]

    text = bestPart?.text
  }
  catch (_e) {
    const e = _e as Error
    throw internal(`Error while fetching Gemini API: ${e.message}`)
  }

  return {
    translation: text,
  }
})
