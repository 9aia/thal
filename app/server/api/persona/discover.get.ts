import { sql } from "drizzle-orm"
import z from "zod"
import { getValidated } from "~/utils/h3"
import { unauthorized } from "~/utils/nuxt"
import { personas } from "~~/db/schema"

export default eventHandler(async (event) => {
  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const query = await getValidated(event, "query", z.object({
    search: z.string().optional(),
  }))

  console.log("query", query.search)
  const search = query.search// ?.toLowerCase()

  const p2 = orm.query.personas.findMany({
    with: {
      personaUsernames: true,
    },
    where: query.search ? (personas, { sql }) => sql`lower(${personas.name}) like ${sql.placeholder("name")}` : undefined,
  }).prepare()

  return await p2.execute({ name: `%${search}%` })
})
