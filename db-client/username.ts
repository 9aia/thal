import { block } from '@9aia/castor'
import { sql } from 'drizzle-orm'
import { usernames } from '~~/db/schema'
import { now } from '~~/app/utils/date'

block('List all usernames', {
  query: db => db.select().from(usernames),
})

block('Update all usernames to lowercase', {
  query: db => (
    db.update(usernames)
      .set({
        text: sql<string>`LOWER(${usernames.text})`,
        updatedAt: now(),
      })
      .returning()
  ),
})
