import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { ExerciseQA } from "../types";
import { z } from "zod";

export const exercises = sqliteTable("Exercises", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  lessonId: integer("lesson_id").notNull(),
  type: text("type").notNull(),
  data: text("data", { mode: "json" }).$type<ExerciseQA>().notNull(),
});

export const selectExerciseSchema = createSelectSchema(exercises);

export const insertExerciseSchema = createInsertSchema(exercises).omit({
  id: true,
});

export type InsertExerciseSchema = z.infer<typeof insertExerciseSchema>;
