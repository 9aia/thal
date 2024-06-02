import { z } from "zod"
import { eq } from "drizzle-orm"
import { exercises } from "~~/db/schema"
import { getValidated } from "~/utils/h3"
import { unauthorized } from "~/utils/nuxt"
import { numericString } from "~/utils/zod"
import { findExerciseImplementation } from "~/constants/exercises"

export default eventHandler(async (event) => {
  const { id } = await getValidated(event, "params", z.object({ id: numericString(z.number()) }))
  const { answer } = await getValidated(event, "body", z.object({ answer: z.number() }))

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const [exercise] = await orm.select().from(exercises).where(eq(exercises.id, id))

  const implementation = findExerciseImplementation(exercise.type)
  const correct = implementation.verify(exercise.data, answer)

  return { correct }
})
