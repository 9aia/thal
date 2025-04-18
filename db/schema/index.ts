/* eslint-disable ts/no-use-before-define */
import { foreignKey, int, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { relations, sql } from 'drizzle-orm'
import { z } from 'zod'
import type { MessageData } from '~/types'

// #region Users

export enum SubscriptionStatus {
  not_subscribed = 0,
  trialing = 1,
  active = 2,
  incomplete = 3,
  incomplete_expired = 4,
  paused = 5,
  canceled = 6,
  unpaid = 7,
  past_due = 8,
}

export enum PlanType {
  ALL_IN_ONE = 0,
}

export const users = sqliteTable('User', {
  id: text('id').primaryKey(),
  username: text('username').unique().notNull(),
  name: text('name').notNull(),
  lastName: text('last_name').notNull(),
  pronouns: text('pronouns'),
  picture: text('picture'),
  createdAt: text('created_at').notNull(),
  email: text('email'),
  plan: int('plan'),
  freeTrialUsed: int('free_trial_used', { mode: 'boolean' }).default(false),
  subscriptionStatus: int('subscription_status').default(SubscriptionStatus.not_subscribed),
  subscriptionId: text('subscription_id'),
  stripeCustomerId: text('stripe_customer_id'),
  checkoutId: text('checkout_id'),
  deactivatedAt: int('deactivated_at', { mode: 'timestamp_ms' }),
})

export const sessions = sqliteTable('Session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: int('expires_at', { mode: 'timestamp' }).notNull(),
})

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

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
  .regex(/^\w+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })

export const nameSchema = z.string().min(1).max(20)
export const pronounsSchema = z.string().min(0).max(20).nullish()

export const userSelectSchema = createSelectSchema(users, {
  name: nameSchema,
  lastName: nameSchema,
  username: usernameSchema,
  pronouns: pronounsSchema,
  email: z.string().email().optional().nullable(),
})

export const userInsertSchema = createInsertSchema(users, {
  id: id => id.optional(),
  name: nameSchema,
  lastName: nameSchema,
  username: usernameSchema,
  pronouns: pronounsSchema,
  email: z.string().email(),
  createdAt: createdAt => createdAt.optional(),
})

export const userUpdateSchema = createInsertSchema(users, {
  name: nameSchema,
  lastName: nameSchema,
  username: usernameSchema,
  pronouns: pronounsSchema,
  email: z.string().email(),
}).partial()

export type UserSelect = z.infer<typeof userSelectSchema>
export type UserInsert = z.infer<typeof userInsertSchema>
export type UserUpdate = z.infer<typeof userUpdateSchema>
export type User = UserSelect

export const sessionSelectSchema = createSelectSchema(sessions)

export type SessionSelect = z.infer<typeof sessionSelectSchema>
export type Session = SessionSelect

// #endregion

// #region Characters

export const descriptionSchema = z.string().min(1).max(100)
export const instructionsSchema = z.string().min(1).max(500)

export const characters = sqliteTable('Character', {
  id: int('id').primaryKey({ autoIncrement: true }),
  categoryId: int('category_id').notNull(),
  discoverable: int('discoverable', { mode: 'boolean' }).default(true).notNull(),
  creatorId: text('creator_id')
    .references(() => users.id, { onDelete: 'no action' }),
  createdAt: text('created_at').notNull(),
})

export const characterRelations = relations(characters, ({ one, many }) => ({
  characterUsernames: one(characterUsernames),
  characterLocalizations: many(characterLocalizations),
}))

export const characterGetSchema = createSelectSchema(characters)
  .omit({
    creatorId: true,
  })

export type CharacterGet = z.infer<typeof characterGetSchema>

export const characterDataSchema = createInsertSchema(characters).omit({
  id: true,
  createdAt: true,
  discoverable: true,
})
  .extend({
    username: usernameSchema,
  })

// #endregion

// #region CharacterLocalizations

export const characterLocalizations = sqliteTable('CharacterLocalization', {
  id: int('id').primaryKey({ autoIncrement: true }),
  characterId: int('character_id')
    .references(() => characters.id, { onDelete: 'cascade' }),
  locale: text('locale').notNull(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  instructions: text('instructions').notNull(),
})

export const characterLocalizationsRelations = relations(characterLocalizations, ({ one }) => ({
  character: one(characters, {
    fields: [characterLocalizations.characterId],
    references: [characters.id],
  }),
}))

export const characterLocalizationsSchema = createInsertSchema(characterLocalizations)

export type characterLocalizationsGet = z.infer<typeof characterLocalizationsSchema>

// #endregion

// #region CharacterDrafts

export const characterDraftSchema = z.object({
  prompt: z.string(),
  locale: z.enum(['pt-BR', 'en-US']),
})

export type CharacterDraftData = z.infer<typeof characterDataSchema>

export const characterDraftInsertSchema = z.object({
  characterId: z.number().optional(),
  discoverable: z.boolean().default(true),
})

export const characterDrafts = sqliteTable('CharacterDraft', {
  id: int('id').primaryKey({ autoIncrement: true }),
  characterId: int('character_id')
    .references(() => characters.id, { onDelete: 'cascade' }),
  creatorId: text('creator_id')
    .references(() => users.id, { onDelete: 'no action' }),
  prompt: text('prompt').notNull(),
  data: text('data', { mode: 'json' }).$type<CharacterDraftData>().notNull(),
  createdAt: text('created_at').notNull(),
})

export const characterDraftsRelations = relations(characterDrafts, ({ one, many }) => ({
  character: one(characters, {
    fields: [characterDrafts.characterId],
    references: [characters.id],
  }),
  characterDraftLocalizations: many(characterDraftLocalizations),
}))

export const characterDraftLocalizations = sqliteTable('CharacterDraftLocalization', {
  id: int('id').primaryKey({ autoIncrement: true }),
  characterDraftId: int('character_draft_id')
    .references(() => characterDrafts.id, { onDelete: 'cascade' }),
  locale: text('locale').notNull(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  instructions: text('instructions').notNull(),
})

export const characterDraftLocalizationsRelations = relations(characterDraftLocalizations, ({ one }) => ({
  characterDraft: one(characterDrafts, {
    fields: [characterDraftLocalizations.characterDraftId],
    references: [characterDrafts.id],
  }),
}))

// #endregion

// #region CharacterUsernames

export const characterUsernames = sqliteTable('CharacterUsername', {
  id: int('id').primaryKey({ autoIncrement: true }),
  characterId: int('character_id')
    .references(() => characters.id, { onDelete: 'set null' }),
  username: text('username').unique().notNull(),
})

export const characterUsernameUpdateSchema = createInsertSchema(characterUsernames, {
  username: usernameSchema,
})

export const characterUsernameInsertSchema = createInsertSchema(characterUsernames, {
  username: usernameSchema,
}).omit({
  id: true,
})

export const characterUsernameRelations = relations(characterUsernames, ({ one, many }) => ({
  character: one(characters, {
    fields: [characterUsernames.characterId],
    references: [characters.id],
  }),
  chats: many(chats),
  contacts: many(contacts),
}))

// #endregion

// #region Contacts

export const contacts = sqliteTable('Contact', {
  id: int('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  characterUsernameId: int('character_username_id')
    .notNull()
    .references(() => characterUsernames.id, { onDelete: 'no action' }),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt: text('created_at').notNull(),
}, t => ({
  unq: unique().on(t.userId, t.characterUsernameId),
}))

export const contactsRelations = relations(contacts, ({ one }) => ({
  chat: one(chats, {
    fields: [contacts.id],
    references: [chats.contactId],
  }),
  characterUsername: one(characterUsernames, {
    fields: [contacts.characterUsernameId],
    references: [characterUsernames.id],
  }),
  user: one(users, {
    fields: [contacts.userId],
    references: [users.id],
  }),
}))

export const contactSchema = createSelectSchema(contacts)

export const contactGetSchema = createSelectSchema(contacts).omit({
  userId: true,
  characterUsernameId: true,
})
  .extend({
    username: usernameSchema,
  })

export const contactInsertSchema = createInsertSchema(contacts).omit({
  id: true,
  userId: true,
  characterUsernameId: true,
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
    characterUsernameId: true,
    createdAt: true,
  })
  .partial()

export type ContactEntity = z.infer<typeof contactSchema>
export type ContactGetDto = z.infer<typeof contactGetSchema>
export type ContactInsertDto = z.infer<typeof contactInsertSchema>
export type ContactUpdateDto = z.infer<typeof contactUpdateSchema>

// #endregion

// #region Chats

export const lastMessages = sqliteTable('LastMessage', {
  id: int('id').primaryKey({ autoIncrement: true }),
  chatId: int('chat_id')
    .notNull()
    .references(() => chats.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  datetime: int('datetime', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => sql`CURRENT_TIMESTAMP`),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
})

export const lastMessageRelations = relations(lastMessages, ({ one }) => ({
  chat: one(chats, {
    fields: [lastMessages.chatId],
    references: [chats.id],
  }),
}))

export const selectLastMessageSchema = createSelectSchema(lastMessages)
export const insertLastMessageSchema = createInsertSchema(lastMessages)

export type LastMessageSelect = z.infer<typeof selectLastMessageSchema>
export type LastMessageInsert = z.infer<typeof insertLastMessageSchema>

export const chats = sqliteTable('Chat', {
  id: int('id').primaryKey({ autoIncrement: true }),
  characterUsernameId: int('character_username_id')
    .notNull()
    .references(() => characterUsernames.id, { onDelete: 'no action' }),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  contactId: int('contact_id')
    .references(() => contacts.id, { onDelete: 'set null' }),
  createdAt: text('created_at').notNull(),
}, t => ({
  unq: unique().on(t.userId, t.characterUsernameId),
}))

export const chatsRelations = relations(chats, ({ one, many }) => ({
  contact: one(contacts, {
    fields: [chats.contactId],
    references: [contacts.id],
  }),
  characterUsername: one(characterUsernames, {
    fields: [chats.characterUsernameId],
    references: [characterUsernames.id],
  }),
  user: one(users, {
    fields: [chats.userId],
    references: [users.id],
  }),
  messages: many(messages),
  lastMessages: one(lastMessages),
}))

// #endregion

// #region Messages

export const messages = sqliteTable('Message', {
  id: int('id').primaryKey({ autoIncrement: true }),
  chatId: int('chat_id')
    .notNull()
    .references(() => chats.id, { onDelete: 'cascade' }),
  data: text('data', { mode: 'json' }).$type<MessageData>().notNull(),
  replyingId: int('replying_id'),
  isBot: int('is_bot').default(0).notNull(),
  createdAt: int('created_at').notNull(),
}, self => ({
  parentReference: foreignKey({
    columns: [self.replyingId],
    foreignColumns: [self.id],
    name: 'messages_replying_id_fkey',
  }),
}))

export const messageRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  }),
}))

export const messageSendSchema = z.object({
  type: z.enum(['text']),
  value: z.string(),
  replyingId: z.number().optional(),
  replyMessage: z.string().optional(),
  replyFrom: z.enum(['user', 'bot']).optional(),
})

export const selectMessageSchema = createSelectSchema(messages)
export const insertMessageSchema = createInsertSchema(messages)

export type MessageSelect = z.infer<typeof selectMessageSchema>
export type MessageInsert = Omit<z.infer<typeof insertMessageSchema>, 'data'> & {
  data: MessageData
}

// #endregion
