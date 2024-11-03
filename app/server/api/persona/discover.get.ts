import { unauthorized } from "~/utils/nuxt"
import { personas } from "~~/db/schema"

export default eventHandler(async (event) => {
  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  return await orm.select().from(personas)
})
