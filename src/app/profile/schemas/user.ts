import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import {
  MAX_GOALS_AMOUNT,
  MAX_HOBBIES_AMOUNT,
  MAX_OBSERVATION_CHARS,
  MAX_PROFESSION_CHARS,
} from '../constants'

export const users = sqliteTable('Users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  lastName: text('lastName').notNull(),
  username: text('username').notNull().unique(),
  signupDate: text('signupDate').notNull(),
  pronouns: text('pronouns'),
  location: text('location'),
  goals: text('goals'),
  profession: text('profession'),
  hobbies: text('hobbies'),
  observation: text('observation'),
  plan: text('plan'),
  payment_gateway_customer_id: text('payment_gateway_customer_id'),
  payment_gateway_session_id: text('payment_gateway_session_id'),
  plan_expires: text('plan_expires'),
  free_trial_used: int('free_trial_used').default(0),
})

export const usernameSchema = z
  .string()
  .min(1, { message: 'Username must be at least 1 character long' })
  .max(20, { message: 'Username must be at most 20 characters long' })
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })

export const nameSchema = z.string().min(1).max(20)
export const pronounsSchema = z.string().max(20).optional()

export const userUpdateSchema = createInsertSchema(users, {
  name: nameSchema,
  lastName: nameSchema,
  username: usernameSchema,
  pronouns: pronounsSchema,
  hobbies: schema =>
    schema.hobbies.refine(
      hobbies => hobbies.split(',').length <= MAX_HOBBIES_AMOUNT,
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
      goals => goals.split(',').length <= MAX_GOALS_AMOUNT,
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

export const userSelectSchema = createSelectSchema(users, {
  name: nameSchema,
  lastName: nameSchema,
  pronouns: pronounsSchema,
})
export const userInsertSchema = createInsertSchema(users, {
  name: nameSchema,
  lastName: nameSchema,
  username: usernameSchema,
  pronouns: pronounsSchema,
  signupDate: schema => schema.signupDate.optional(),
})

export type UserInsert = z.infer<typeof userInsertSchema>
export type User = z.infer<typeof userSelectSchema>
