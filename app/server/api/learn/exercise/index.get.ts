import { exercises } from "~~/db/schema"
import { unauthorized } from "~/utils/nuxt"

export default defineEventHandler(async (event) => {
  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  const values = await orm.select().from(exercises)

  return values
})
