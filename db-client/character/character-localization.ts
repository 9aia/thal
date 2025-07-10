import { block } from '@9aia/castor'
import { eq } from 'drizzle-orm'
import { characterLocalizations } from '~~/db/schema'

block('List character localizations', {
  query: db => db.select().from(characterLocalizations),
})

block('Get the first character localization', {
  query: db => db.select().from(characterLocalizations).where(eq(characterLocalizations.locale, 'en-US')).limit(1),
})
