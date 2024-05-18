import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import type { z } from "zod"
import type { ExerciseQAWithCorrect } from "../types"

export const exercises = sqliteTable("Exercises", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  lessonId: integer("lesson_id").notNull(),
  type: text("type").notNull(),
  data: text("data", { mode: "json" }).$type<ExerciseQAWithCorrect>().notNull(),
})

export const selectExerciseSchema = createSelectSchema(exercises)

export const insertExerciseSchema = createInsertSchema(exercises).omit({
  id: true,
})

export type InsertExerciseSchema = z.infer<typeof insertExerciseSchema>
