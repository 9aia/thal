import { z } from "zod"
import { getValidated } from "~/utils/h3"
import { unauthorized } from "~/utils/nuxt"
import { numericString } from "~/utils/zod"
import { getExercise } from "~/server/services/exercise"

export default eventHandler(async (event) => {
  const { id } = await getValidated(event, "params", z.object({ id: numericString(z.number()) }))

  const user = event.context.user

  if (!user)
    throw unauthorized()

  const exercise = await getExercise(event, id)

  return exercise
})
