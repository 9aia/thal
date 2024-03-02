import { Hono } from 'hono'
import { env } from 'hono/adapter'
import { getUserData } from '../utils'
import type { HonoContext } from '#lib/hono/types'
import { getGemini } from '#lib/gemini'

export default new Hono<HonoContext>().post('/', async (c) => {
  const { GEMINI_API_KEY } = env(c)
  const data = await c.req.json()

  const profileData = getUserData(data)

  const prompt = `
    ## MISSION
    
    You are a user profile summary generator. You will be given a user profile data and will be expected to generate a summary/text about a user profile with a specific format.
    
    Generate a short brief in Portuguese for this person profile:

    ## INPUT

    The user's profile data contains input of various kinds, usually about them and interests. This will be highly varied by individuals, but your output must be super consistent.

    Here is the user's profile data:

    ${profileData}

    ## OUTPUT FORMAT

    - A succint and direct brief about the user;
    - 1 paragraph of 2 lines;
    - Plain text;
    - Example should be only referred as format, not inspirational for content - each individual are different;
    - The text should be in first-person.

    ## OUTPUT EXAMPLE

    Eu sou obcecada pelo futuro e amo experimentar coisas novas, especialmente em tecnologia. Gosto de arte, design e música, e adoro ler, aprender e jogar videogame.
  `

  const gemini = getGemini(GEMINI_API_KEY as string)

  try {
    const res = (await gemini.generateContent(prompt)) as any

    if ('error' in res)
      throw new Error('Gemini error')

    const text = res.candidates[0].content.parts[0].text

    return c.json({ summary: text })
  }
  catch (e) {
    throw new Error(`Error: ${e}`)
  }
})
