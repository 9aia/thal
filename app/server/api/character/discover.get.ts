import z from 'zod'
import { and, eq, like } from 'drizzle-orm'
import { calculatePagination, getPaginatedDto } from '~/utils/data'
import { getValidated } from '~/utils/h3'
import { unauthorized } from '~/utils/nuxt'
import { numericString } from '~/utils/zod'
import { paginationSchema } from '~/schemas/data'
import { characterLocalizations, characters, usernames } from '~~/db/schema'

export default eventHandler(async (event) => {
  const query = await getValidated(event, 'query', paginationSchema().extend({
    search: z.string().optional().transform(s => s?.trim()),
    categoryId: numericString(z.number().optional()),
    locale: z.string(),
  }))

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const { limit, offset } = calculatePagination(query)

  const result = await orm
    .select({
      id: characters.id,
      categoryId: characters.categoryId,
      createdAt: characters.createdAt,
      creatorId: characters.creatorId,
      discoverable: characters.discoverable,
      username: usernames.text,
      name: characterLocalizations.name,
      description: characterLocalizations.description,
    })
    .from(characters)
    .leftJoin(usernames, eq(usernames.characterId, characters.id))
    .leftJoin(characterLocalizations, and(
      eq(characterLocalizations.characterId, characters.id),
      eq(characterLocalizations.locale, query.locale),
    ))
    .where(
      and(
        query.categoryId ? eq(characters.categoryId, query.categoryId) : undefined,
        eq(characters.discoverable, true),
        query.search
          ? like(characterLocalizations.name, `%${query.search}%`)
          : undefined,
      ),
    )
    .limit(limit)
    .offset(offset)

  return getPaginatedDto(query, result)
})
