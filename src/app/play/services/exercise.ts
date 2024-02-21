import { eq } from 'drizzle-orm'
import type { Context } from 'hono'
import type { InsertExerciseSchema } from '../schemas/exercises'
import { exercises } from '../schemas/exercises'
import { notFound } from '#lib/hono/utils/httpStatus'
import type { HonoContext } from '#lib/hono/types'

export async function getExercise(c: Context<HonoContext>, exerciseId: number) {
  const orm = c.get('orm')
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
  c: Context<HonoContext>,
  insertExercise: InsertExerciseSchema,
) {
  const orm = c.get('orm')
  const [exercise] = await orm
    .insert(exercises)
    .values(insertExercise as any)
    .returning()

  return exercise
}
