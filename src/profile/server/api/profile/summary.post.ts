import { getGemini } from '~/src/base/utils/gemini'
import { getValidated } from '~/src/base/utils/h3'
import { getUserData } from '~/src/profile/utils/profile'
import { profileDataSchema } from '../../schema'

export default eventHandler(async (event) => {
  const { GEMINI_API_KEY } = process.env
  const data = await getValidated(event, 'body', profileDataSchema)

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

    if ('error' in res) {
      throw internal('Gemini internal error')
    }

    const text = res.candidates[0].content.parts[0].text

    return { summary: text }
  } catch (e) {
    throw internal('Error while fetching Gemini API')
  }
})
