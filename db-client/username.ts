import { block } from '@9aia/castor'
import { sql } from 'drizzle-orm'
import { usernames } from '~~/db/schema'

block('List all usernames', {
  query: db => db.select().from(usernames),
})

block('Update all usernames to lowercase', {
  query: db => (
    db.update(usernames)
      .set({ username: sql`LOWER(${usernames.username})` })
      .returning()
  ),
})
