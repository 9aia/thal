import { eq } from "drizzle-orm"
import { z } from "zod"
import { findExerciseImplementation } from "~/constants/exercises"
import { nextExercise } from "~/server/services/exercise"
import { getLessonState } from "~/server/services/lesson"
import { getValidated } from "~/utils/h3"
import { unauthorized } from "~/utils/nuxt"
import { numericString } from "~/utils/zod"
import { exercises } from "~~/db/schema"

export default eventHandler(async (event) => {
  const { id } = await getValidated(event, "params", z.object({ id: numericString(z.number()) }))
  const {
    answer,
    levelSlug,
    unitSlug,
    lessonIndex,
  } = await getValidated(event, "body", z.object({
    answer: z.number().nullable(),
    unitSlug: z.string(),
    levelSlug: z.string(),
    lessonIndex: z.number(),
  }))

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const [exercise] = await orm.select().from(exercises).where(eq(exercises.id, id))

  const implementation = findExerciseImplementation(exercise.type)
  const correct = implementation.verify(exercise.data, answer)

  await nextExercise(event, unitSlug, levelSlug)

  const nextLessonState = await getLessonState(event, { lessonIndex, levelSlug, unitSlug })

  return { correct, nextLessonState }
})
