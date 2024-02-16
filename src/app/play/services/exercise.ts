import { Context } from "hono";
import { InsertExerciseSchema, exercises } from "../schemas/exercises";
import { eq } from "drizzle-orm";
import { notFound } from "#framework/utils/httpThrowers";
import { ApiContext } from "#framework/api";

export async function getExercise(c: Context<ApiContext>, exerciseId: number) {
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
  c: Context<ApiContext>,
  insertExercise: InsertExerciseSchema
) {
  const orm = c.get("orm");
  const [exercise] = await orm
    .insert(exercises)
    .values(insertExercise)
    .returning();

  return exercise;
}
