import { sqliteTable, text, int } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const users = sqliteTable('User', {
  id: text('id').primaryKey(),
  username: text('username').unique().notNull(),
  name: text('name').notNull(),
  lastName: text('last_name').notNull(),
  pronouns: text('pronouns'),
  picture: text('picture'),
  createdAt: text('createdAt').notNull(),
  email: text('email'),
  plan: text('plan'),
  payment_gateway_customer_id: text('payment_gateway_customer_id'),
  payment_gateway_session_id: text('payment_gateway_session_id'),
  plan_expires: text('plan_expires'),
  free_trial_used: int('free_trial_used').default(0),
})

export const sessions = sqliteTable('Session', {
  id: text('id').primaryKey(),
  expiresAt: int('expires_at', { mode: 'timestamp' }).notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
})

export const oAuthAccounts = sqliteTable('OAuthAccount', {
  providerId: text('provider_id').notNull(),
  providerUserId: text('provider_user_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
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

export const userSelectSchema = createSelectSchema(users, {
  name: nameSchema,
  lastName: nameSchema,
  username: usernameSchema,
  pronouns: pronounsSchema,
  email: z.string().email(),
  createdAt: schema => schema.createdAt.optional(),
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

export type UserSelect = z.infer<typeof userSelectSchema>
export type UserInsert = z.infer<typeof userInsertSchema>
