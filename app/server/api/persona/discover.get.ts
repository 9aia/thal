import z from "zod"
import { getValidated } from "~/utils/h3"
import { unauthorized } from "~/utils/nuxt"
import { numericString } from "~/utils/zod"

export default eventHandler(async (event) => {
  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const query = await getValidated(event, "query", z.object({
    search: z.string().optional(),
    categoryId: numericString(z.number().optional()),
  }))

  const search = query.search?.trim()

  const p2 = orm.query.personas.findMany({
    with: {
      personaUsernames: true,
    },
    where: (personas, { sql, and, eq, or }) => and(
      search ? sql`lower(${personas.name}) like ${sql.placeholder("name")}` : undefined,
      query.categoryId ? sql`category_id = ${query.categoryId}` : undefined,
      or(eq(personas.discoverable, true), eq(personas.creatorId, user.id)),
    ),
  }).prepare()

  return await p2.execute({ name: `%${search}%` })
})
