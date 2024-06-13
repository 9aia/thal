import { z } from "zod"
import { MAX_EXERCISE_AMOUNT } from "~/constants/exercises"
import { generateExercise, getExercise } from "~/server/services/exercise"
import { goToNextLesson } from "~/server/services/lesson"
import { getLevel } from "~/server/services/level"
import { getValidated } from "~/utils/h3"
import { getLessonDto, getMaxLessonAmount } from "~/utils/learn/exercise"
import { badRequest, internal, unauthorized } from "~/utils/nuxt"

export default eventHandler(async (event) => {
  const {
    levelSlug,
    unitSlug,
  } = await getValidated(event, "body", z.object({
    unitSlug: z.string(),
    levelSlug: z.string(),
  }))

  const user = event.context.user

  if (!user)
    throw unauthorized()

  const level = await getLevel(event, unitSlug, levelSlug)

  const maxLessonLength = getMaxLessonAmount("a1", unitSlug, levelSlug)

  if (!maxLessonLength)
    throw internal("Max lesson length is not defined")

  if (level.lessonIndex + 1 > maxLessonLength - 1)
    throw badRequest("You are not in the last lesson")

  if (level.currentExercise === MAX_EXERCISE_AMOUNT) {
    const updatedLevel = await goToNextLesson(event, { unitSlug, levelSlug })

    const exercise = await generateExercise(event, user!, {
      lessonIndex: updatedLevel.lessonIndex,
      levelSlug: updatedLevel.slug,
      unitSlug: updatedLevel.unitSlug,
      position: 0,
    })

    return getLessonDto(exercise, updatedLevel)
  }

  throw badRequest("You are not in the last exercise")
})
