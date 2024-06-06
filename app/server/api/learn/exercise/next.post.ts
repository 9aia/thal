import { z } from "zod"
import { nextExercise } from "~/server/services/exercise"
import { getValidated } from "~/utils/h3"
import { unauthorized } from "~/utils/nuxt"

export default eventHandler(async (event) => {
  const data = await getValidated(event, "body", z.object({
    unitSlug: z.string(),
    levelSlug: z.string(),
  }))
  const nextDto = data

  const user = event.context.user

  if (!user)
    throw unauthorized()

  const { currentExercise } = await nextExercise(event, nextDto)

  return {
    currentExercise,
  }
})
