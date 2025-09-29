import { block } from '@9aia/castor'
import { isNotNull, isNull, sql } from 'drizzle-orm'
import { now } from '#shared/utils/date'
import { usernames } from '~~/server/db/schema'

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

block('Delete all character usernames', {
  danger: true,
  query: db => db.delete(usernames).where(isNotNull(usernames.characterId)),
})

block('Delete all character usernames that has no `userId`', {
  danger: true,
  query: db => db.delete(usernames).where(isNull(usernames.userId)),
})
