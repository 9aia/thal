import { deleteSessionTokenCookie, invalidateSession } from '../../services/auth'
import { unauthorized } from '~~/server/utils/nuxt'

export default eventHandler(async (event) => {
  const orm = event.context.orm
  const session = event.context.session

  if (!session)
    throw unauthorized()

  await invalidateSession(orm, session.id)

  deleteSessionTokenCookie(event)

  return sendRedirect(event, '/sign-in')
})
