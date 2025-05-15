import z from 'zod'
import { calculatePagination, getPaginatedDto } from '~/utils/data'
import { getValidated } from '~/utils/h3'
import { unauthorized } from '~/utils/nuxt'
import { numericString } from '~/utils/zod'
import { paginationSchema } from '~/schemas/data'
import { characterLocalizations } from '~~/db/schema'

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

  const ormQuery = orm.query.characters.findMany({
    limit,
    offset,
    with: {
      usernames: true,
      characterLocalizations: {
        columns: {
          name: true,
          description: true,
          instructions: true,
        },
        where: (characters, { sql, and, eq }) => and(query.search
          ? sql`lower(${characters.name}) like ${sql.placeholder('name')}`
          : undefined, eq(characterLocalizations.locale, query.locale)),
      },
    },
    where: (characters, { sql, and, eq }) => and(
      query.categoryId
        ? sql`category_id = ${query.categoryId}`
        : undefined,
      eq(characters.discoverable, true),
    ),
  }).prepare()

  const result = await ormQuery.execute({ name: `%${query.search}%` })

  return getPaginatedDto(query, result)
})
