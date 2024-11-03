import process from "node:process"
import { z } from "zod"
import { profileDataSchema } from "../../../../schemas/profile"
import { getGemini } from "~/utils/gemini"
import { getValidated } from "~/utils/h3"
import { forbidden, internal, unauthorized } from "~/utils/nuxt"
import { getUserData } from "~/utils/profile"

export default eventHandler(async (event) => {
  const { username } = await getValidated(event, "params", z.object({ username: z.string() }))

  const { GEMINI_API_KEY } = process.env

  const user = event.context.user

  if (!user)
    throw unauthorized()

  if (username !== user.username)
    throw forbidden()

  const data = await getValidated(event, "body", profileDataSchema)

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
    - The text should be in first-person;
    - If no data is provided, just ignore or generate "Profile private or not filled.".

    ## OUTPUT EXAMPLE

    Eu sou obcecada pelo futuro e amo experimentar coisas novas, especialmente em tecnologia. Gosto de arte, design e música, e adoro ler, aprender e jogar videogame.
  `

  const gemini = getGemini(GEMINI_API_KEY as string)
  const res = await gemini.generateContent(prompt)
  const bestCandidate = res.candidates?.[0]
  const bestPart = bestCandidate?.content?.parts?.[0]
  const text: string = bestPart?.text

  if (!text)
    throw internal("Gemini did not return a valid translation")

  return { summary: text as string }
})
