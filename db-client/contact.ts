import { block } from '@9aia/castor'
import { contacts } from '~~/db/schema'

block('List all contacts', {
  query: db => db.select().from(contacts),
})

block('Delete all contacts', {
  danger: true,
  query: db => (
    db.delete(contacts)
  ),
})
