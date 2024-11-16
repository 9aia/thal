import { invalidateSession } from "../../services/auth"
import { unauthorized } from "~/utils/nuxt"

export default eventHandler(async (event) => {
  const orm = event.context.orm
  const session = event.context.session

  if (!session)
    throw unauthorized()

  await invalidateSession(orm, session.id)

  return sendRedirect(event, "/sign-in")
})
