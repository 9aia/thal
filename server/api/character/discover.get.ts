import { and, eq, isNull, like } from 'drizzle-orm'
import z from 'zod'
import { paginationSchema } from '#shared/schemas/pagination'
import { calculatePagination, getPaginatedDto } from '~~/server/utils/pagination'
import { getValidated } from '~~/server/utils/h3'
import { unauthorized } from '~~/server/utils/nuxt'
import { numericString } from '#shared/utils/zod'
import { characterLocalizations, characters, localeSchema, usernames } from '~~/server/db/schema'

export default eventHandler(async (event) => {
  const query = await getValidated(event, 'query', paginationSchema().extend({
    search: z.string().optional().transform(s => s?.trim()),
    categoryId: numericString(z.number().optional()),
    locale: localeSchema,
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
      eq(characterLocalizations.locale, query.locale!),
    ))
    .where(
      and(
        query.categoryId ? eq(characters.categoryId, query.categoryId) : undefined,
        eq(characters.discoverable, true),
        query.search
          ? like(characterLocalizations.name, `%${query.search}%`)
          : undefined,
        isNull(characters.deletedAt),
        isNull(characterLocalizations.deletedAt),
      ),
    )
    .limit(limit)
    .offset(offset)

  return getPaginatedDto(query, result)
})
