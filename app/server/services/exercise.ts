import process from "node:process"
import type { GenerationConfig } from "@google/generative-ai"
import { and, eq } from "drizzle-orm"
import type { H3Event } from "h3"
import { getLevel } from "./level"
import type { ExercisePromptOptions } from "~/constants/exercises"
import EXERCISES from "~/constants/exercises"
import type { ExerciseGenerateDto } from "~/types"
import { getGemini } from "~/utils/gemini"
import { getMaxExerciseAmount } from "~/utils/learn/exercise"
import { badRequest, internal } from "~/utils/nuxt"
import type { ExerciseInsert, UserSelect } from "~~/db/schema"
import { exercises, levels } from "~~/db/schema"

export async function getExercise(
  event: H3Event,
  { unitSlug, levelSlug, position, lessonIndex }: ExerciseGenerateDto,
) {
  const orm = event.context.orm

  const user = event.context.user!

  const [exercise] = await orm
    .select()
    .from(exercises)
    .where(
      and(
        eq(exercises.unitSlug, unitSlug),
        eq(exercises.levelSlug, levelSlug),
        eq(exercises.position, position),
        eq(exercises.lessonIndex, lessonIndex),
        eq(exercises.userId, user.id),
      ),
    )

  return exercise
}

export async function generateExercise(
  event: H3Event,
  user: UserSelect,
  exerciseGenerateDto: ExerciseGenerateDto,
) {
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
    unitSlug: exerciseGenerateDto.unitSlug,
    levelSlug: exerciseGenerateDto.levelSlug,
    position: exerciseGenerateDto.position,
    lessonIndex: exerciseGenerateDto.lessonIndex,
    data: parsedExercise,
    userId: user.id,
  })

  return savedExercise
}

async function saveExercise(
  event: H3Event,
  insertExercise: ExerciseInsert,
) {
  const orm = event.context.orm

  const [exercise] = await orm
    .insert(exercises)
    .values(insertExercise as any)
    .returning()

  return exercise
}

export async function nextExercise(
  event: H3Event,
  unitSlug: string,
  levelSlug: string,
) {
  const orm = event.context.orm

  const user = event.context.user!

  const level = await getLevel(event, unitSlug, levelSlug)

  const maxExerciseAmount = getMaxExerciseAmount("a1", unitSlug, levelSlug)

  if (!maxExerciseAmount)
    throw internal("Max exercise amount is not defined")

  const isFinal = level.lastExercisePosition + 1 > maxExerciseAmount + 1
  let lastExercisePosition = level.lastExercisePosition

  if (!isFinal) {
    const [updatedLevel] = await orm
      .update(levels)
      .set({ ...level, lastExercisePosition: lastExercisePosition + 1 })
      .where(and(eq(levels.unitSlug, unitSlug), eq(levels.slug, levelSlug), eq(levels.userId, user.id)))
      .returning()

    lastExercisePosition = updatedLevel.lastExercisePosition
  }
  else {
    throw badRequest("You are already in the last exercise")
  }

  return {
    lastExercisePosition,
  }
}
