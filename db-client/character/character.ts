import { block } from '@9aia/castor'
import { eq, isNotNull } from 'drizzle-orm'
import { z } from 'zod'
import { now } from '~~/app/utils/date'
import { characterDraftLocalizations, characterDrafts, characterLocalizations, characters, usernames } from '~~/db/schema'

block('List all characters', {
  query: db => db.select().from(characters),
})

block('Delete all character data', {
  danger: true,
  run: db => db.batch([
    db.delete(characters),
    db.delete(usernames).where(isNotNull(usernames.characterId)),
    db.delete(characterDraftLocalizations),
    db.delete(characterDrafts),
  ]),
})

block('Make all characters discoverable', {
  query: db => db.update(characters).set({
    discoverable: true,
    updatedAt: now(),
  }).returning(),
})

block('Make all characters undiscoverable', {
  query: db => db.update(characters).set({
    discoverable: false,
    updatedAt: now(),
  }).returning(),
})

block('Toggle character discoverability', {
  schema: z.object({
    id: z.number(),
  }),
  query: async (db, input) => {
    const character = await db.select()
      .from(characters)
      .where(eq(characters.id, input.id))
      .get()
    if (!character) {
      throw new Error('Character not found')
    }
    return db.update(characters)
      .set({
        discoverable: !character.discoverable,
        updatedAt: now(),
      })
      .where(eq(characters.id, input.id))
      .returning()
  },
})

// -- @block List characters left joined with name

// SELECT c.id, cl.locale, cl.name, cl.description, cl.instructions
//   FROM Character c
//   LEFT JOIN CharacterLocalization cl ON c.id = cl.character_id
//   WHERE cl.locale = 'en-US'

block('List characters left joined with name', {
  query: db => (
    db.select({
      id: characters.id,
      locale: characterLocalizations.locale,
      name: characterLocalizations.name,
      description: characterLocalizations.description,
      instructions: characterLocalizations.instructions,
    })
      .from(characters)
      .leftJoin(characterLocalizations, eq(characters.id, characterLocalizations.characterId))
      .where(eq(characterLocalizations.locale, 'en-US'))
  ),
})
