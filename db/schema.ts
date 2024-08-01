import { int, sqliteTable, text, unique } from "drizzle-orm/sqlite-core"
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

// #region Personas

export const descriptionSchema = z.string().min(1).max(100)
export const instructionsSchema = z.string().min(1).max(500)

export const personas = sqliteTable("Persona", {
  id: int("id").primaryKey({ autoIncrement: true }),
  username: text("username").unique().notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  instructions: text("instructions").notNull(),
  conversationStarters: text("conversation_starters", { mode: "json" }).$type<Array<string>>().notNull(),
  createdAt: text("created_at").notNull(),
  creatorId: text("creator_id")
    .references(() => users.id, { onDelete: "no action" }),
})

export const personaGetSchema = createSelectSchema(personas, {
  conversationStarters: z.array(z.string()),
})
  .omit({
    creatorId: true,
  })
  .extend({
    username: usernameSchema,
  })

export const personaInsertSchema = createInsertSchema(personas, {
  conversationStarters: z.array(z.string()),
})
  .omit({
    id: true,
    creatorId: true,
    createdAt: true,
  })

export const personaUpdateSchema = createInsertSchema(personas, {
  name: nameSchema,
  username: usernameSchema,
  description: descriptionSchema,
  conversationStarters: z.array(z.string()),
})
  .partial()

export type PersonaGet = z.infer<typeof personaGetSchema>
export type PersonaInsert = z.infer<typeof personaInsertSchema>
export type PersonaUpdate = z.infer<typeof personaUpdateSchema>

// #endregion

// #region Contacts

export const contacts = sqliteTable("Contact", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  createdAt: text("created_at").notNull(),
  personaId: int("persona_id")
    .notNull()
    .references(() => personas.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
}, t => ({
  unq: unique().on(t.userId, t.personaId),
}))

export const contactSchema = createSelectSchema(contacts)

export const contactGetSchema = createSelectSchema(contacts).omit({
  userId: true,
  personaId: true,
})
  .extend({
    username: usernameSchema,
  })

export const contactInsertSchema = createInsertSchema(contacts).omit({
  id: true,
  userId: true,
  personaId: true,
  createdAt: true,
})
  .extend({
    username: usernameSchema,
  })

export const contactUpdateSchema = createInsertSchema(contacts, {
  name: nameSchema,
})
  .omit({
    id: true,
    userId: true,
    personaId: true,
    createdAt: true,
  })
  .partial()

export type ContactEntity = z.infer<typeof contactSchema>
export type ContactGetDto = z.infer<typeof contactGetSchema>
export type ContactInsertDto = z.infer<typeof contactInsertSchema>
export type ContactUpdateDto = z.infer<typeof contactUpdateSchema>

// #endregion

// #region Exercises

export const exercises = sqliteTable("Exercise", {
  id: int("id").primaryKey({ autoIncrement: true }),
  unitSlug: text("unit_slug").notNull(),
  levelSlug: text("level_slug").notNull(),
  lessonIndex: int("lesson_index").default(0).notNull(),
  position: int("position").default(0).notNull(),
  type: text("type").notNull(),
  data: text("data", { mode: "json" }).$type<Record<string, any>>().notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
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
  sectionSlug: text("section_slug").notNull(),
  unitSlug: text("unit_slug").notNull(),
  lessonIndex: int("lesson_index").default(0).notNull(),
  lastExercisePosition: int("last_exercise_position").default(0).notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
})

export const selectLevelSchema = createSelectSchema(levels)

export type LevelSelect = z.infer<typeof selectLevelSchema>

// #endregion
