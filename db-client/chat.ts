import { block } from '@9aia/castor'
import { sql } from 'drizzle-orm'
import { chats, lastMessages, messages } from '~~/db/schema'

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
