import { block } from '@9aia/castor'
import { characterDraftLocalizations, characterDrafts } from '~~/server/db/schema'

block('List all drafts', {
  query: db => db.select({
    id: characterDrafts.id,
    deletedAt: characterDrafts.deletedAt,
  }).from(characterDrafts),
})

block('List all draft localizations', {
  query: db => db.select().from(characterDraftLocalizations),
})

block('Delete all character drafts', {
  danger: true,
  run: db => db.batch([
    db.delete(characterDrafts),
    db.delete(characterDraftLocalizations),
  ]),
})
