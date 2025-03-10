import z from 'zod'
import { calculatePagination, getPaginatedDto } from '~/utils/data'
import { getValidated } from '~/utils/h3'
import { unauthorized } from '~/utils/nuxt'
import { numericString } from '~/utils/zod'
import { paginationSchema } from '~/schemas/data'

export default eventHandler(async (event) => {
  const query = await getValidated(event, 'query', paginationSchema().extend({
    search: z.string().optional().transform(s => s?.trim()),
    categoryId: numericString(z.number().optional()),
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
      characterUsernames: true,
    },
    where: (characters, { sql, and, eq, or }) => and(
      query.search
        ? sql`lower(${characters.name}) like ${sql.placeholder('name')}`
        : undefined,
      query.categoryId
        ? sql`category_id = ${query.categoryId}`
        : undefined,
      or(eq(characters.discoverable, true), eq(characters.creatorId, user.id!)),
    ),
  }).prepare()

  const result = await ormQuery.execute({ name: `%${query.search}%` })

  return getPaginatedDto(query, result)
})
