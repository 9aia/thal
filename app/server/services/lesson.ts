import type { H3Event } from "h3"
import { getLevel } from "./level"
import { generateExercise, getExercise } from "./exercise"
import { getLessonDto } from "~/utils/learn/exercise"
import { MAX_EXERCISE_AMOUNT } from "~/constants/exercises"

export async function getLessonState(event: H3Event, {
  unitSlug,
  levelSlug,
  lessonAmount,
}: {
  unitSlug: string
  levelSlug: string
  lessonAmount: number
}) {
  const user = event.context.user

  const level = await getLevel(event, unitSlug, levelSlug)

  const exerciseGenerateDto = {
    unitSlug,
    levelSlug,
    lessonAmount,
    position: level.currentExercise,
  }

  if (level.currentExercise === MAX_EXERCISE_AMOUNT)
    return getLessonDto(null, level)

  const exercise = await getExercise(event, exerciseGenerateDto)

  if (exercise)
    return getLessonDto(exercise, level)

  const newExercise = await generateExercise(event, user!, exerciseGenerateDto)

  return getLessonDto(newExercise, level)
}
