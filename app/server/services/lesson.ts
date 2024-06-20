import type { H3Event } from "h3"
import { and, eq } from "drizzle-orm"
import { generateExercise, getExercise } from "./exercise"
import { getLevel } from "./level"
import { getLessonDto, getMaxExerciseAmount } from "~/utils/learn/exercise"
import { badRequest, internal } from "~/utils/nuxt"
import { levels } from "~~/db/schema"
import type { ExerciseGenerateDto } from "~/types"

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

  const exerciseGenerateDto: ExerciseGenerateDto = {
    unitSlug,
    levelSlug,
    lessonIndex: lessonIndex ?? level.lessonIndex,
    position: level.lastExercisePosition,
  }

  const exercise = await getExercise(event, exerciseGenerateDto)

  const maxExerciseAmount = getMaxExerciseAmount("a1", unitSlug, levelSlug)

  if (!maxExerciseAmount)
    throw internal("Max exercise amount is not defined")

  if (level.lastExercisePosition === maxExerciseAmount)
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

  const user = event.context.user!

  const level = await getLevel(event, unitSlug, levelSlug)

  const maxExerciseAmount = getMaxExerciseAmount("a1", unitSlug, levelSlug)

  if (!maxExerciseAmount)
    throw internal("Max exercise amount is not defined")

  if (level.lastExercisePosition !== maxExerciseAmount)
    throw badRequest("You can't go to the next lesson without finishing the current one")

  const [updatedLevel] = await orm
    .update(levels)
    .set({
      ...level,
      lastExercisePosition: 0,
      lessonIndex: level.lessonIndex + 1,
    })
    .where(
      and(
        eq(levels.unitSlug, unitSlug),
        eq(levels.slug, levelSlug),
        eq(levels.userId, user.id),
      ),
    )
    .returning()

  return updatedLevel
}
