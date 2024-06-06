import { int, sqliteTable, text } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"
import { MAX_GOALS_AMOUNT, MAX_HOBBIES_AMOUNT, MAX_OBSERVATION_CHARS, MAX_PROFESSION_CHARS } from "../app/constants/base"

// #region Users

export const users = sqliteTable("User", {
  id: text("id").primaryKey(),
  username: text("username").unique().notNull(),
  name: text("name").notNull(),
  lastName: text("last_name").notNull(),
  pronouns: text("pronouns"),
  picture: text("picture"),
  createdAt: text("created_at").notNull(),
  email: text("email"),
  plan: text("plan"),
  payment_gateway_customer_id: text("payment_gateway_customer_id"),
  payment_gateway_session_id: text("payment_gateway_session_id"),
  plan_expires: text("plan_expires"),
  free_trial_used: int("free_trial_used").default(0),
  location: text("location"),
  goals: text("goals"),
  profession: text("profession"),
  hobbies: text("hobbies"),
  observation: text("observation"),
})

export const sessions = sqliteTable("Session", {
  id: text("id").primaryKey(),
  expiresAt: int("expires_at", { mode: "timestamp" }).notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
})

export const oAuthAccounts = sqliteTable("OAuthAccount", {
  providerId: text("provider_id").notNull(),
  providerUserId: text("provider_user_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
})

export const usernameSchema = z
  .string()
  .min(1, { message: "Username must be at least 1 character long" })
  .max(20, { message: "Username must be at most 20 characters long" })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "Username can only contain letters, numbers, and underscores",
  })

export const nameSchema = z.string().min(1).max(20)
export const pronounsSchema = z.string().min(0).max(20).nullable()

export const userSelectSchema = createSelectSchema(users, {
  name: nameSchema,
  lastName: nameSchema,
  username: usernameSchema,
  pronouns: pronounsSchema,
  email: z.string().email(),
})

export const userInsertSchema = createInsertSchema(users, {
  id: schema => schema.id.optional(),
  name: nameSchema,
  lastName: nameSchema,
  username: usernameSchema,
  pronouns: pronounsSchema,
  email: z.string().email(),
  createdAt: schema => schema.createdAt.optional(),
})

export const userUpdateSchema = createInsertSchema(users, {
  name: nameSchema,
  lastName: nameSchema,
  username: usernameSchema,
  pronouns: pronounsSchema,
  email: z.string().email(),
  hobbies: schema =>
    schema.hobbies.refine(
      hobbies => hobbies.split(",").length <= MAX_HOBBIES_AMOUNT,
      {
        message: `Hobbies must contain at most ${MAX_HOBBIES_AMOUNT} items separated by commas`,
      },
    ),
  profession: schema =>
    schema.profession.refine(
      profession => profession.length <= MAX_PROFESSION_CHARS,
      {
        message: `Profession must contain at most ${MAX_PROFESSION_CHARS} characters`,
      },
    ),
  goals: schema =>
    schema.goals.refine(
      goals => goals.split(",").length <= MAX_GOALS_AMOUNT,
      {
        message: `Goals must contain at most ${MAX_GOALS_AMOUNT} items separated by commas`,
      },
    ),
  observation: schema =>
    schema.profession.refine(
      profession => profession.length <= MAX_OBSERVATION_CHARS,
      {
        message: `Observation must contain at most ${MAX_OBSERVATION_CHARS} characters`,
      },
    ),
}).partial()

export type UserSelect = z.infer<typeof userSelectSchema>
export type UserInsert = z.infer<typeof userInsertSchema>
export type UserUpdate = z.infer<typeof userUpdateSchema>

// #endregion

// #region Exercises

export const exercises = sqliteTable("Exercise", {
  id: int("id").primaryKey({ autoIncrement: true }),
  unitSlug: text("unit_slug").notNull(),
  levelSlug: text("level_slug").notNull(),
  type: text("type").notNull(),
  data: text("data", { mode: "json" }).$type<Record<string, any>>().notNull(),
})

export const selectExerciseSchema = createSelectSchema(exercises)

export const insertExerciseSchema = createInsertSchema(exercises).omit({
  id: true,
})

export type ExerciseSelect = Omit<z.infer<typeof selectExerciseSchema>, "data"> & {
  data: Record<string, any>
}
export type ExerciseInsert = z.infer<typeof insertExerciseSchema>

// #endregion

// #region Level

export const levels = sqliteTable("Level", {
  id: int("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull(),
  unitSlug: text("unit_slug").notNull(),
  lessonAmount: int("lesson_amount").default(0).notNull(),
  currentExercise: int("current_exercise").default(0).notNull(),
})

export const selectLevelSchema = createSelectSchema(levels)

export type LevelSelect = z.infer<typeof selectLevelSchema>

// #endregion
