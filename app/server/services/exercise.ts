import { eq } from "drizzle-orm"
import type { H3Event } from "h3"
import { notFound } from "~/utils/nuxt"
import type { InsertExerciseSchema } from "~~/db/schema"
import { exercises } from "~~/db/schema"

export async function getExercise(event: H3Event, exerciseId: number) {
  const orm = event.context.orm

  const res = await orm
    .select()
    .from(exercises)
    .where(eq(exercises.id, Number(exerciseId)))
  const exercise = res?.[0]

  if (!exercise)
    throw notFound(`Exercise not found: ${exerciseId}`)

  return exercise
}

export async function saveExercise(
  event: H3Event,
  insertExercise: InsertExerciseSchema,
) {
  const orm = event.context.orm

  const [exercise] = await orm
    .insert(exercises)
    .values(insertExercise as any)
    .returning()

  return exercise
}
