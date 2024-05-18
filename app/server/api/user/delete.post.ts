import { eq } from "drizzle-orm"
import { invalidateSession } from "../../services/user"
import { users } from "~~/db/schema"
import { unauthorized } from "~/utils/nuxt"

export default defineEventHandler(async (event) => {
  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    throw unauthorized()

  await orm.delete(users).where(eq(users.id, user.id))

  await invalidateSession(event)

  return sendRedirect(event, "/deleted-account")
})
