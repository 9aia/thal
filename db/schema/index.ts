/* eslint-disable ts/no-use-before-define */
import { foreignKey, int, sqliteTable, text, unique } from "drizzle-orm/sqlite-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { relations, sql } from "drizzle-orm"
import { z } from "zod"
import { MAX_GOALS_AMOUNT, MAX_HOBBIES_AMOUNT, MAX_OBSERVATION_CHARS, MAX_PROFESSION_CHARS } from "../../app/constants/base"
import type { MessageData } from "~/types"

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

// #region Characters

export const descriptionSchema = z.string().min(1).max(100)
export const instructionsSchema = z.string().min(1).max(500)

export const personas = sqliteTable("Persona", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  instructions: text("instructions").notNull(),
  conversationStarters: text("conversation_starters").notNull(),
  createdAt: text("created_at").notNull(),
  creatorId: text("creator_id")
    .references(() => users.id, { onDelete: "no action" }),
})

export const personaRelations = relations(personas, ({ one }) => ({
  personaUsernames: one(personaUsernames),
}))

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
  .extend({
    username: usernameSchema,
  })
  .omit({
    id: true,
    creatorId: true,
    createdAt: true,
  })

export const personaUpdateSchema = createInsertSchema(personas, {
  name: nameSchema,
  description: descriptionSchema,
  conversationStarters: z.array(z.string()),
})
  .extend({
    username: usernameSchema,
  })
  .partial()

export type PersonaGet = z.infer<typeof personaGetSchema>
export type PersonaInsert = z.infer<typeof personaInsertSchema>
export type PersonaUpdate = z.infer<typeof personaUpdateSchema>

// #endregion

// #region PersonaUsernames

export const personaUsernames = sqliteTable("PersonaUsername", {
  id: int("id").primaryKey({ autoIncrement: true }),
  personaId: int("persona_id")
    .references(() => personas.id, { onDelete: "set null" }),
  username: text("username").unique().notNull(),
})

export const personaUsernameUpdateSchema = createInsertSchema(personaUsernames, {
  username: usernameSchema,
})

export const personaUsernameInsertSchema = createInsertSchema(personaUsernames, {
  username: usernameSchema,
}).omit({
  id: true,
})

export const personaUsernameRelations = relations(personaUsernames, ({ one, many }) => ({
  persona: one(personas, {
    fields: [personaUsernames.personaId],
    references: [personas.id],
  }),
  chats: many(chats),
  contacts: many(contacts),
}))

// #endregion

// #region Contacts

export const contacts = sqliteTable("Contact", {
  id: int("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  personaUsernameId: int("persona_username_id")
    .notNull()
    .references(() => personaUsernames.id, { onDelete: "no action" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: text("created_at").notNull(),
}, t => ({
  unq: unique().on(t.userId, t.personaUsernameId),
}))

export const contactsRelations = relations(contacts, ({ one }) => ({
  chat: one(chats, {
    fields: [contacts.id],
    references: [chats.contactId],
  }),
  personaUsername: one(personaUsernames, {
    fields: [contacts.personaUsernameId],
    references: [personaUsernames.id],
  }),
  user: one(users, {
    fields: [contacts.userId],
    references: [users.id],
  }),
}))

export const contactSchema = createSelectSchema(contacts)

export const contactGetSchema = createSelectSchema(contacts).omit({
  userId: true,
  personaUsernameId: true,
})
  .extend({
    username: usernameSchema,
  })

export const contactInsertSchema = createInsertSchema(contacts).omit({
  id: true,
  userId: true,
  personaUsernameId: true,
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
    personaUsernameId: true,
    createdAt: true,
  })
  .partial()

export type ContactEntity = z.infer<typeof contactSchema>
export type ContactGetDto = z.infer<typeof contactGetSchema>
export type ContactInsertDto = z.infer<typeof contactInsertSchema>
export type ContactUpdateDto = z.infer<typeof contactUpdateSchema>

// #endregion

// #region Chats

export const lastMessages = sqliteTable("LastMessage", {
  id: int("id").primaryKey({ autoIncrement: true }),
  chatId: int("chat_id")
    .notNull()
    .references(() => chats.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  datetime: int("datetime", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => sql`CURRENT_TIMESTAMP`),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
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

export const chats = sqliteTable("Chat", {
  id: int("id").primaryKey({ autoIncrement: true }),
  personaUsernameId: int("persona_username_id")
    .notNull()
    .references(() => personaUsernames.id, { onDelete: "no action" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  contactId: int("contact_id")
    .references(() => contacts.id, { onDelete: "set null" }),
  createdAt: text("created_at").notNull(),
}, t => ({
  unq: unique().on(t.userId, t.personaUsernameId),
}))

export const chatsRelations = relations(chats, ({ one, many }) => ({
  contact: one(contacts, {
    fields: [chats.contactId],
    references: [contacts.id],
  }),
  personaUsername: one(personaUsernames, {
    fields: [chats.personaUsernameId],
    references: [personaUsernames.id],
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

export const messages = sqliteTable("Message", {
  id: int("id").primaryKey({ autoIncrement: true }),
  chatId: int("chat_id")
    .notNull()
    .references(() => chats.id, { onDelete: "cascade" }),
  data: text("data", { mode: "json" }).$type<MessageData>().notNull(),
  replyingId: int("replying_id"),
  isBot: int("is_bot").default(0).notNull(),
  createdAt: int("created_at").notNull(),
}, self => ({
  parentReference: foreignKey({
    columns: [self.replyingId],
    foreignColumns: [self.id],
    name: "messages_replying_id_fkey",
  }),
}))

export const messageRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  }),
}))

export const messageSendSchema = z.object({
  type: z.enum(["text"]),
  value: z.string(),
  replyingId: z.number().optional(),
  replyMessage: z.string().optional(),
  replyFrom: z.enum(["user", "bot"]).optional(),
})

export const selectMessageSchema = createSelectSchema(messages)
export const insertMessageSchema = createInsertSchema(messages)

export type MessageSelect = z.infer<typeof selectMessageSchema>
export type MessageInsert = Omit<z.infer<typeof insertMessageSchema>, "data"> & {
  data: MessageData
}

// #endregion
