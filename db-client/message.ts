import { block } from '@9aia/castor'
import { messages } from '~~/db/schema'

block('List all messages', {
  query: db => db.select().from(messages),
})

block('Delete all messages', {
  danger: true,
  query: db => (
    db.delete(messages)
  ),
})
