import process from "node:process"
import type { GenerationConfig } from "@google/generative-ai"
import { z } from "zod"
import type { ExercisePromptOptions } from "~/constants/exercises"
import EXERCISES from "~/constants/exercises"
import { saveExercise } from "~/server/services/exercise"
import { getGemini } from "~/utils/gemini"
import { getValidated } from "~/utils/h3"
import { unauthorized } from "~/utils/nuxt"

export default eventHandler(async (event) => {
  const data = await getValidated(event, "body", z.object({
    lessonId: z.string(),
  }))

  const user = event.context.user

  if (!user)
    throw unauthorized()

  const options: ExercisePromptOptions = {
    goals: user.goals || "",
    hobbies: user.hobbies || "",
    profession: user.profession || "",
    observation: user.observation || "",
    section: "a1",
    languageFrom: "Português",
    languageTo: "English",
  }

  const index = Math.floor(Math.random() * Object.keys(EXERCISES).length)
  const exercise = EXERCISES[index]

  const promptData = exercise?.prompt(options)

  const prompt = `
    You are an exercise generator for an English learning app, where students can learn with lessons individually personalized.

    ${promptData.instructions}

    ## Output Criteria

    - Your output should be a complete valid JSON.
    - The output should follow exactly the format in the example below;
    ${promptData.criteria || ""}

    ## Output Example

    ${JSON.stringify(promptData.example)}
  `

  const { GEMINI_API_KEY } = process.env
  const gemini = getGemini(GEMINI_API_KEY as string)
  const generationConfig: GenerationConfig = {
    temperature: 0.9,
  }

  const result = await gemini.generateContent(prompt, generationConfig)

  if ("error" in result)
    throw new Error("Gemini 500")

  const text = result.candidates[0].content.parts[0].text

  let parsedExercise

  try {
    parsedExercise = JSON.parse(text)
  }
  catch (e) {
    throw new Error("Invalid JSON")
  }

  const savedExercise = await saveExercise(event, {
    type: exercise.name,
    lessonId: data.lessonId,
    data: parsedExercise,
  })

  const processedData = exercise.postprocess(parsedExercise)

  const frontExercise = {
    id: savedExercise.id,
    lessonId: savedExercise.lessonId,
    type: savedExercise.type,
    data: processedData,
  }

  console.log(frontExercise)

  return frontExercise
})
