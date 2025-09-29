import { block } from '@9aia/castor'
import { inArray, isNull, sql } from 'drizzle-orm'
import { chats, lastMessages, messages, usernames } from '~~/server/db/schema'

block('List all chats', {
  query: db => db.select().from(chats),
})

block('Delete all chats', {
  danger: true,
  query: db => db.delete(chats),
})

block('Drop chat table', {
  danger: true,
  run: db => db.run(sql`DROP TABLE ${chats}`),
})

block('Delete chats with username that has no character', {
  query: db => db.delete(chats).where(
    inArray(chats.usernameId, db.select({ id: usernames.id }).from(usernames).where(isNull(usernames.characterId))),
  ),
})

block('Delete last messages', {
  danger: true,
  query: db => db.delete(lastMessages),
})

block('Clear messages', {
  danger: true,
  query: db => db.batch([
    db.delete(chats),
    db.delete(messages),
    db.delete(lastMessages),
  ]),
})
