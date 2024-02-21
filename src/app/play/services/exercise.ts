import { HonoContext } from "#lib/hono/types";
import { notFound } from "#lib/hono/utils/httpStatus";
import { eq } from "drizzle-orm";
import { Context } from "hono";
import { InsertExerciseSchema, exercises } from "../schemas/exercises";

export async function getExercise(c: Context<HonoContext>, exerciseId: number) {
  const orm = c.get("orm");
  const res = await orm
    .select()
    .from(exercises)
    .where(eq(exercises.id, Number(exerciseId)));
  const exercise = res?.[0];

  if (!exercise) {
    throw notFound(`Exercise not found: ${exerciseId}`);
  }

  return exercise;
}

export async function saveExercise(
  c: Context<HonoContext>,
  insertExercise: InsertExerciseSchema
) {
  const orm = c.get("orm");
  const [exercise] = await orm
    .insert(exercises)
    .values(insertExercise as any)
    .returning();

  return exercise;
}
