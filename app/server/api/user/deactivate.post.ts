import { eq } from 'drizzle-orm'
import { invalidateSession } from '~/server/services/auth'
import { getSubscriptionId, pauseSubscription } from '~/server/services/plan'
import { now } from '~/utils/date'
import { internal, unauthorized } from '~/utils/nuxt'
import { getStripe } from '~/utils/stripe'
import { users } from '~~/db/schema'
import { getEnv } from '~/utils/envs'

export default defineEventHandler(async (event) => {
  const orm = event.context.orm
  const user = event.context.user
  const session = event.context.session

  const { STRIPE_SECRET_KEY } = getEnv(event)

  if (!STRIPE_SECRET_KEY)
    throw internal('STRIPE_SECRET_KEY is not set in the environment')

  if (!user || !session)
    throw unauthorized()

  const stripe = getStripe({ stripeKey: STRIPE_SECRET_KEY! })
  const subscriptionId = await getSubscriptionId(stripe, user)

  await pauseSubscription(stripe, subscriptionId)

  await orm.update(users).set({
    deactivatedAt: now(),
  }).where(eq(users.id, user.id!))

  await invalidateSession(orm, session.id)

  return sendRedirect(event, '/deactivated-account')
})
