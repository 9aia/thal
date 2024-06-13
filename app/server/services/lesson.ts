import type { H3Event } from "h3"
import { getLevel } from "./level"
import { generateExercise, getExercise } from "./exercise"
import { getLessonDto } from "~/utils/learn/exercise"
import { MAX_EXERCISE_AMOUNT } from "~/constants/exercises"
import { levels } from "~~/db/schema"
import { badRequest } from "~/utils/nuxt"

export async function getLessonState(event: H3Event, {
  unitSlug,
  levelSlug,
  lessonIndex,
}: {
  unitSlug: string
  levelSlug: string
  lessonIndex?: number
}) {
  const user = event.context.user

  const level = await getLevel(event, unitSlug, levelSlug)

  const exerciseGenerateDto = {
    unitSlug,
    levelSlug,
    lessonIndex: lessonIndex ?? level.lessonIndex,
    position: level.currentExercise,
  }

  const exercise = await getExercise(event, exerciseGenerateDto)

  if (level.currentExercise === MAX_EXERCISE_AMOUNT)
    return getLessonDto(null, level)

  if (exercise)
    return getLessonDto(exercise, level)

  const newExercise = await generateExercise(event, user!, exerciseGenerateDto)

  return getLessonDto(newExercise, level)
}

export async function goToNextLesson(event: H3Event, {
  unitSlug,
  levelSlug,
}: {
  unitSlug: string
  levelSlug: string
}) {
  const orm = event.context.orm

  const level = await getLevel(event, unitSlug, levelSlug)

  if (level.currentExercise !== MAX_EXERCISE_AMOUNT)
    throw badRequest("You can't go to the next lesson without finishing the current one")

  const [updatedLevel] = await orm
    .update(levels)
    .set({
      ...level,
      currentExercise: 0,
      lessonIndex: level.lessonIndex + 1,
    })
    .returning()

  return updatedLevel
}
