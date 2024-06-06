import { z } from "zod"
import { generateExercise, getExercise } from "~/server/services/exercise"
import { getLevel } from "~/server/services/level"
import { getValidated } from "~/utils/h3"
import { getLessonDto } from "~/utils/learn/exercise"
import { unauthorized } from "~/utils/nuxt"
import { numericString } from "~/utils/zod"

export default eventHandler(async (event) => {
  const data = await getValidated(event, "body", z.object({
    unitSlug: z.string(),
    levelSlug: z.string(),
    lessonAmount: numericString(z.number()),
  }))
  const exerciseGenerateDto = data

  const user = event.context.user

  if (!user)
    throw unauthorized()

  const exercise = await getExercise(event, exerciseGenerateDto)
  const level = await getLevel(event, exerciseGenerateDto)

  if (exercise)
    return getLessonDto(exercise, level)

  const newExercise = await generateExercise(event, user, exerciseGenerateDto)

  return getLessonDto(newExercise, level)
})
