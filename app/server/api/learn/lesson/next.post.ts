import { z } from "zod"
import { generateExercise } from "~/server/services/exercise"
import { goToNextLesson } from "~/server/services/lesson"
import { getLevel } from "~/server/services/level"
import { getValidated } from "~/utils/h3"
import { getLessonDto, getMaxExerciseAmount, getMaxLessonAmount } from "~/utils/learn/exercise"
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

  const maxLessonAmount = getMaxLessonAmount("a1", unitSlug, levelSlug)

  if (!maxLessonAmount)
    throw internal("Max lesson amount is not defined")

  if (level.lessonIndex + 1 > maxLessonAmount - 1)
    throw badRequest("You are not in the last lesson")

  const maxExerciseAmount = getMaxExerciseAmount("a1", unitSlug, levelSlug)

  if (!maxExerciseAmount)
    throw internal("Max exercise amount is not defined")

  if (level.lastExercisePosition >= maxExerciseAmount) {
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
