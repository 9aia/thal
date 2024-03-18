import { eq } from "drizzle-orm"
import { users } from "~/src/base/server/db/schema"
import { unauthorized } from "~/src/base/utils/nuxt"
import { invalidateSession } from "../services/user"

export default defineEventHandler(async (event) => {
  const orm = event.context.orm
  const user = event.context.user

  if(!user) {
    throw unauthorized()
  }

  await orm.delete(users).where(eq(users.id, user.id))

  await invalidateSession(event)

  return sendRedirect(event, '/deleted-account')
})
