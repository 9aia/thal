import { eq } from 'drizzle-orm'
import { users } from '~~/db/schema'
import { unauthorized } from '~/utils/nuxt'
import { invalidateSession } from '~/server/services/auth'
import { now } from '~/utils/date'

export default defineEventHandler(async (event) => {
  const orm = event.context.orm
  const user = event.context.user
  const session = event.context.session

  if (!user || !session)
    throw unauthorized()

  await orm.update(users).set({
    deactivatedAt: now(),
  }).where(eq(users.id, user.id!))

  await invalidateSession(orm, session.id)

  return sendRedirect(event, '/deactivated-account')
})
