import { block } from '@9aia/castor'
import { and, eq, sql } from 'drizzle-orm'
import { z } from 'zod'
import { characterLocalizations, characters, usernames } from '~~/db/schema'

block('List character localizations', {
  query: db => db.select().from(characterLocalizations),
})

block('List character localizations with just id, truncated description and deletedAt', {
  query: db => db.select({
    id: characterLocalizations.id,
    description: sql`substring(${characterLocalizations.description}, 1, 100)`,
    deletedAt: characterLocalizations.deletedAt,
  }).from(characterLocalizations),
})

block('Get the first character localization', {
  query: db => db.select().from(characterLocalizations).where(eq(characterLocalizations.locale, 'en-US')).limit(1),
})

block('Get the character localization by character username', {
  schema: z.object({
    username: z.string(),
  }),
  run: async (db, input) => {
    const result = await db.select()
      .from(usernames)
      .leftJoin(characters, eq(usernames.characterId, characters.id))
      .leftJoin(characterLocalizations, eq(characters.id, characterLocalizations.characterId))
      .where(
        and(
          eq(characterLocalizations.locale, 'en-US'),
          eq(usernames.text, input.username),
        ),
      )

    console.log(result)
  },
})
