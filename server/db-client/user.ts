import { block } from '@9aia/castor'
import { sql } from 'drizzle-orm'
import { oAuthAccounts, sessions, users } from '~~/server/db/schema'

block('Drop user tables', {
  danger: true,
  run: db => db.run(sql`
    DROP TABLE ${users};
    DROP TABLE ${oAuthAccounts};
    DROP TABLE ${sessions}
  `),
})

block('Delete all users', {
  danger: true,
  run: db => db.batch([
    db.delete(users),
    db.delete(sessions),
    db.delete(oAuthAccounts),
  ]),
})

block('List all users', {
  query: db => db.select().from(users),
})

block('List all sessions', {
  query: db => db.select().from(sessions),
})

block('Delete all sessions', {
  danger: true,
  query: db => db.delete(sessions),
})
