/* eslint-disable ts/no-use-before-define */
import { relations, sql } from 'drizzle-orm'
import { foreignKey, int, sqliteTable as table, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { createdAt, timestampOmits, timestamps, updatedAt } from '../columns.helpers'
import type { MessageAnalysisData } from '~/types'

// #region Usernames

export const usernameSchemaBase = z.string().min(1).max(32)
  .regex(/^\w+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })

export const usernameSchemaChecks = {
  min: usernameSchemaBase._def.checks.find(check => check.kind === 'min')?.value,
  max: usernameSchemaBase._def.checks.find(check => check.kind === 'max')?.value,
}

export const usernameSchema = usernameSchemaBase.refine(
  value => value === value.toLowerCase(),
  {
    message: 'Username should have only lowercase letters',
  },
)

export const usernames = table('Username', {
  id: int('id').primaryKey({ autoIncrement: true }),
  characterId: int('character_id')
    .references(() => characters.id, { onDelete: 'set null' }),
  userId: text('user_id')
    .references(() => users.id, { onDelete: 'set null' }),
  text: text('text').notNull(),
  createdAt,
  updatedAt,
})

export const usernameUpdateSchema = createInsertSchema(usernames, {
  text: usernameSchema,
})
  .omit({ createdAt: true, updatedAt: true })

export const usernameInsertSchema = createInsertSchema(usernames, {
  text: usernameSchema,
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
})

export const usernameRelations = relations(usernames, ({ one, many }) => ({
  character: one(characters, {
    fields: [usernames.characterId],
    references: [characters.id],
  }),
  user: one(users, {
    fields: [usernames.userId],
    references: [users.id],
  }),
  chats: many(chats),
  contacts: many(contacts),
}))

// #endregion

// #region Subscriptions

export enum SubscriptionStatus {
  not_subscribed = 0,
  trialing,
  active,
  incomplete,
  incomplete_expired,
  paused,
  canceled,
  unpaid,
  past_due,
}

export enum PlanType {
  STANDARD_MONTHLY = 0,
}

// #endregion

// #region Users

export const users = table('User', {
  id: text('id').primaryKey(),

  name: text('name').notNull(),
  lastName: text('last_name').notNull(),
  picture: text('picture'),
  email: text('email'),

  plan: int('plan').$type<PlanType>(),
  freeTrialUsed: int('free_trial_used', { mode: 'boolean' }).default(false),
  subscriptionStatus: int('subscription_status').default(SubscriptionStatus.not_subscribed).$type<SubscriptionStatus>(),
  subscriptionId: text('subscription_id'),
  stripeCustomerId: text('stripe_customer_id'),
  checkoutId: text('checkout_id'),

  deactivatedAt: int('deactivated_at', { mode: 'timestamp_ms' }),
  ...timestamps,
})

export const userRelations = relations(users, ({ one }) => ({
  username: one(usernames, {
    fields: [users.id],
    references: [usernames.userId],
  }),
}))

export const nameSchema = z.string().min(1).max(64)
export const nameSchemaChecks = {
  min: nameSchema._def.checks.find(check => check.kind === 'min')?.value,
  max: nameSchema._def.checks.find(check => check.kind === 'max')?.value,
}

export const userNameSchema = z.string().min(1).max(32)
export const userNameSchemaChecks = {
  min: userNameSchema._def.checks.find(check => check.kind === 'min')?.value,
  max: userNameSchema._def.checks.find(check => check.kind === 'max')?.value,
}

export const userLastNameSchema = z.string().min(1).max(32)
export const userLastNameSchemaChecks = {
  min: userLastNameSchema._def.checks.find(check => check.kind === 'min')?.value,
  max: userLastNameSchema._def.checks.find(check => check.kind === 'max')?.value,
}

export const userSelectSchema = createSelectSchema(users, {
  name: userNameSchema,
  lastName: userLastNameSchema,
  email: z.string().email().optional().nullable(),
})
  .extend({
    username: usernameSchema,
  })

export const userInsertSchema = createInsertSchema(users, {
  id: id => id.optional(),
  name: userNameSchema,
  lastName: userLastNameSchema,
  email: z.string().email(),
})
  .omit({ ...timestampOmits })
  .extend({
    username: usernameSchema,
  })

export type UserSelect = z.infer<typeof userSelectSchema>
export type UserInsert = z.infer<typeof userInsertSchema>
export type User = UserSelect

// #endregion

// #region Sessions

export const sessions = table('Session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: int('expires_at', { mode: 'timestamp_ms' }).notNull(),
  createdAt,
  updatedAt,
})

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

export const oAuthAccounts = table('OAuthAccount', {
  providerId: text('provider_id').notNull(),
  providerUserId: text('provider_user_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
})

export const sessionSelectSchema = createSelectSchema(sessions)
  .omit({
    createdAt: true,
    updatedAt: true,
  })

export type SessionSelect = z.infer<typeof sessionSelectSchema>
export type Session = SessionSelect

// #endregion

// #region Profile

export const profileUpdateSchema = createInsertSchema(users, {
  name: userNameSchema,
  lastName: userLastNameSchema,
  email: z.string().email(),
})
  .omit({
    ...timestampOmits,
    id: true,

    email: true,
    picture: true,

    // For security reasons, we don't want to update these fields
    deactivatedAt: true,

    checkoutId: true,
    subscriptionId: true,
    stripeCustomerId: true,
    plan: true,
    freeTrialUsed: true,
    subscriptionStatus: true,
  })
  .extend({
    username: usernameSchema,
  })
  .partial()

export type ProfileUpdate = z.infer<typeof profileUpdateSchema>

// #endregion

// #region Characters

export const descriptionSchema = z.string().min(1).max(300)
export const descriptionSchemaChecks = {
  min: descriptionSchema._def.checks.find(check => check.kind === 'min')?.value,
  max: descriptionSchema._def.checks.find(check => check.kind === 'max')?.value,
}

export const instructionsSchema = z.string().min(1).max(1000)
export const instructionsSchemaChecks = {
  min: instructionsSchema._def.checks.find(check => check.kind === 'min')?.value,
  max: instructionsSchema._def.checks.find(check => check.kind === 'max')?.value,
}
export const characters = table('Character', {
  id: int('id').primaryKey({ autoIncrement: true }),
  categoryId: int('category_id').notNull(),
  discoverable: int('discoverable', { mode: 'boolean' }).default(true).notNull(),
  prompt: text('prompt').notNull(),
  creatorId: text('creator_id')
    .references(() => users.id, { onDelete: 'set null' }),
  ...timestamps,
})

export const characterRelations = relations(characters, ({ one, many }) => ({
  usernames: one(usernames),
  characterLocalizations: many(characterLocalizations),
}))

export const characterGetSchema = createSelectSchema(characters)
  .omit({
    creatorId: true,
  })

export type CharacterGet = z.infer<typeof characterGetSchema>

export const characterDataSchema = createInsertSchema(characters)
  .omit({
    discoverable: true,
    prompt: true,
    creatorId: true,
    ...timestampOmits,
  })
  .extend({ username: usernameSchema })

// #endregion

// #region CharacterLocalizations

export const characterLocalizations = table('CharacterLocalization', {
  id: int('id').primaryKey({ autoIncrement: true }),
  characterId: int('character_id')
    .references(() => characters.id, { onDelete: 'cascade' }),
  locale: text('locale').notNull(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  instructions: text('instructions').notNull(),
  ...timestamps,
})

export const characterLocalizationsRelations = relations(characterLocalizations, ({ one }) => ({
  character: one(characters, {
    fields: [characterLocalizations.characterId],
    references: [characters.id],
  }),
}))

export const characterLocalizationsSchema = createInsertSchema(characterLocalizations)
  .omit({ ...timestampOmits })

export type characterLocalizationsGet = z.infer<typeof characterLocalizationsSchema>

// #endregion

// #region CharacterDrafts

export const promptSchema = z.string().min(1).max(1000)
export const promptSchemaChecks = {
  min: promptSchema._def.checks.find(check => check.kind === 'min')?.value,
  max: promptSchema._def.checks.find(check => check.kind === 'max')?.value,
}

export const characterDraftSchema = z.object({
  prompt: promptSchema,
  locale: z.enum(['pt-BR', 'en-US']),
})

export type CharacterDraftData = z.infer<typeof characterDataSchema>

export const characterDraftInsertSchema = z.object({
  characterId: z.number().optional(),
  discoverable: z.boolean().default(true),
})

export const characterDrafts = table('CharacterDraft', {
  id: int('id').primaryKey({ autoIncrement: true }),
  characterId: int('character_id')
    .references(() => characters.id, { onDelete: 'cascade' }),
  creatorId: text('creator_id')
    .references(() => users.id, { onDelete: 'no action' }),
  prompt: text('prompt').notNull(),
  data: text('data', { mode: 'json' }).$type<CharacterDraftData>().notNull(),
  ...timestamps,
})

export const characterDraftsRelations = relations(characterDrafts, ({ one, many }) => ({
  character: one(characters, {
    fields: [characterDrafts.characterId],
    references: [characters.id],
  }),
  characterDraftLocalizations: many(characterDraftLocalizations),
}))

export const characterDraftLocalizations = table('CharacterDraftLocalization', {
  id: int('id').primaryKey({ autoIncrement: true }),
  characterDraftId: int('character_draft_id')
    .references(() => characterDrafts.id, { onDelete: 'cascade' }),
  locale: text('locale').notNull(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  instructions: text('instructions').notNull(),
  ...timestamps,
})

export const characterDraftLocalizationsRelations = relations(characterDraftLocalizations, ({ one }) => ({
  characterDraft: one(characterDrafts, {
    fields: [characterDraftLocalizations.characterDraftId],
    references: [characterDrafts.id],
  }),
}))

// #endregion

// #region Contacts

export const contacts = table('Contact', {
  id: int('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  usernameId: int('username_id') // added
    .notNull()
    .references(() => usernames.id, { onDelete: 'no action' }),
  userId: text('user_id') // adder
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  createdAt,
  updatedAt,
})

export const contactsRelations = relations(contacts, ({ one }) => ({
  chat: one(chats, {
    fields: [contacts.id],
    references: [chats.contactId],
  }),
  username: one(usernames, {
    fields: [contacts.usernameId],
    references: [usernames.id],
  }),
  user: one(users, {
    fields: [contacts.userId],
    references: [users.id],
  }),
}))

export const contactSchema = createSelectSchema(contacts)

export const contactGetSchema = createSelectSchema(contacts).omit({
  userId: true,
  usernameId: true,
})
  .extend({
    username: usernameSchema,
  })

export const contactInsertSchema = createInsertSchema(contacts)
  .omit({
    id: true,
    userId: true,
    usernameId: true,
    createdAt: true,
    updatedAt: true,
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
    usernameId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial()

export type ContactEntity = z.infer<typeof contactSchema>
export type ContactGetDto = z.infer<typeof contactGetSchema>
export type ContactInsertDto = z.infer<typeof contactInsertSchema>
export type ContactUpdateDto = z.infer<typeof contactUpdateSchema>

// #endregion

// #region LastMessages

export const lastMessages = table('LastMessage', {
  id: int('id').primaryKey({ autoIncrement: true }),
  chatId: int('chat_id')
    .notNull()
    .references(() => chats.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  status: int('status').notNull().$type<MessageStatus>(),
  datetime: int('datetime', { mode: 'timestamp_ms' })
    .default(sql`(unixepoch() * 1000)`)
    .notNull(),
  createdAt,
  updatedAt,
})

export const lastMessageRelations = relations(lastMessages, ({ one }) => ({
  chat: one(chats, {
    fields: [lastMessages.chatId],
    references: [chats.id],
  }),
}))

export const selectLastMessageSchema = createSelectSchema(lastMessages)
export const insertLastMessageSchema = createInsertSchema(lastMessages)
  .omit({
    createdAt: true,
    updatedAt: true,
  })

export type LastMessageSelect = z.infer<typeof selectLastMessageSchema>
export type LastMessageInsert = z.infer<typeof insertLastMessageSchema>

// #endregion

// #region Chats

export const chats = table('Chat', {
  id: int('id').primaryKey({ autoIncrement: true }),
  usernameId: int('username_id')
    .notNull()
    .references(() => usernames.id, { onDelete: 'no action' }),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  contactId: int('contact_id')
    .references(() => contacts.id, { onDelete: 'set null' }),
  createdAt,
  updatedAt,
})

export const chatsRelations = relations(chats, ({ one, many }) => ({
  contact: one(contacts, {
    fields: [chats.contactId],
    references: [contacts.id],
  }),
  username: one(usernames, {
    fields: [chats.usernameId],
    references: [usernames.id],
  }),
  user: one(users, {
    fields: [chats.userId],
    references: [users.id],
  }),
  messages: many(messages),
  lastMessages: one(lastMessages),
}))

// #endregion

// #region MessageStatus

export enum MessageStatus {
  sending = 0,
  error,
  received,
  seen,
  sent,
  read,
}

// #endregion

// #region InReplyTo

export const inReplyToSchema = z.object({
  id: z.number(),
  content: z.string(),
  status: z.nativeEnum(MessageStatus),
  from: z.enum(['user', 'bot']), // TODO: change to username
})

export type InReplyTo = z.infer<typeof inReplyToSchema>

// #endregion

// #region Messages

export const messages = table('Message', {
  id: int('id').primaryKey({ autoIncrement: true }),
  chatId: int('chat_id')
    .notNull()
    .references(() => chats.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  status: int('status').notNull().$type<MessageStatus>(),
  inReplyToId: int('in_reply_to_id'),
  isBot: int('is_bot', { mode: 'boolean' }).default(false).notNull(), // TODO: change to speaker username (user or bot)
  ...timestamps,
}, messages => ([
  foreignKey({
    columns: [messages.inReplyToId],
    foreignColumns: [messages.id],
    name: 'messages_in_reply_to_id_fkey',
  }),
]))

export const messageRelations = relations(messages, ({ one, many }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  }),
  inReplyTo: one(messages, {
    fields: [messages.inReplyToId],
    references: [messages.id],
  }),
  messageAnalysis: many(messageAnalyses),
}))

export const messageContentSchema = z.string().max(1000)

export const messageContentSchemaChecks = {
  max: messageContentSchema._def.checks.find(check => check.kind === 'max')?.value,
}

export const messageSchema = z.object({
  content: messageContentSchema,
  inReplyTo: inReplyToSchema.optional(),
})

export const selectMessageSchema = createSelectSchema(messages)
export const insertMessageSchema = createInsertSchema(messages)
  .omit({ ...timestampOmits })

export type MessageSelect = z.infer<typeof selectMessageSchema>
export type MessageInsert = z.infer<typeof insertMessageSchema>

export type MessagePost = z.infer<typeof messageSchema>

export const messageAnalyses = table('MessageAnalyses', {
  id: int('id').primaryKey({ autoIncrement: true }),
  data: text('data', { mode: 'json' }).notNull().$type<MessageAnalysisData>(),
  messageId: int('message_id')
    .notNull()
    .unique()
    .references(() => messages.id, { onDelete: 'cascade' }),
  createdAt,
  updatedAt,
})

export const messageAnalysisRelations = relations(messageAnalyses, ({ one }) => ({
  message: one(messages, {
    fields: [messageAnalyses.messageId],
    references: [messages.id],
  }),
}))

// #endregion
