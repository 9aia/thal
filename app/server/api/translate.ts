import process from 'node:process'
import { z } from 'zod'
import { getGemini } from '~/utils/gemini'
import { getValidated } from '~/utils/h3'
import { internal, unauthorized } from '~/utils/nuxt'

export default defineEventHandler(async (event) => {
  const { GEMINI_API_KEY } = process.env

  if (!GEMINI_API_KEY)
    throw internal('GEMINI_API_KEY is not set in the environment')

  const user = event.context.user

  if (!user)
    throw unauthorized()

  const data = await getValidated(event, 'body', z.object({
    text: z.string(),
    locale: z.string().min(2).max(5),
  }))

  const systemInstruction = `You are an en-US - ${data.locale} translator. Please translate the text directly without further explanation. Keep the original file format.`
  const prompt = `${data.text}`

  const gemini = getGemini(GEMINI_API_KEY as string)
  const res = await gemini.generateContent(prompt, systemInstruction)
  const bestCandidate = res.candidates?.[0]
  const bestPart = bestCandidate?.content?.parts?.[0]
  const text: string = bestPart?.text

  if (!text)
    throw internal('Gemini did not return a valid translation')

  return {
    translation: text,
  }
})
