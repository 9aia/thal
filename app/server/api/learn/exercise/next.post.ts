import { z } from "zod"
import { generateExercise, getExercise } from "~/server/services/exercise"
import { getValidated } from "~/utils/h3"
import { convertExerciseEntityToGenerateDto } from "~/utils/learn/exercise"
import { unauthorized } from "~/utils/nuxt"

export default eventHandler(async (event) => {
  const data = await getValidated(event, "body", z.object({
    unitSlug: z.string(),
    levelSlug: z.string(),
  }))
  const exerciseGenerateDto = data

  const user = event.context.user

  if (!user)
    throw unauthorized()

  /*  const exercise = await getExercise(event, exerciseGenerateDto)

  if (exercise)
    return convertExerciseEntityToGenerateDto(exercise) */

  const newExercise = await generateExercise(event, user, exerciseGenerateDto)

  return convertExerciseEntityToGenerateDto(newExercise)
})
