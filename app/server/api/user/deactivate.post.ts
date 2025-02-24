import { eq } from 'drizzle-orm'
import { invalidateSession } from '~/server/services/auth'
import { pauseStripeSubscription } from '~/server/services/plan'
import { now } from '~/utils/date'
import { internal, unauthorized } from '~/utils/nuxt'
import { getStripe } from '~/utils/stripe'
import { users } from '~~/db/schema'

export default defineEventHandler(async (event) => {
  const orm = event.context.orm
  const user = event.context.user
  const session = event.context.session

  const { STRIPE_SECRET_KEY } = useRuntimeConfig(event)

  if (!STRIPE_SECRET_KEY)
    throw internal('STRIPE_SECRET_KEY is not set in the environment')

  if (!user || !session)
    throw unauthorized()

  const stripe = getStripe({ stripeKey: STRIPE_SECRET_KEY! })
  const subscriptionId = user.subscriptionId

  if (!subscriptionId)
    throw internal('User does not have a subscription')

  await pauseStripeSubscription(stripe, subscriptionId)

  await orm.update(users).set({
    deactivatedAt: now(),
  }).where(eq(users.id, user.id!))

  await invalidateSession(orm, session.id)

  return sendRedirect(event, '/deactivated-account')
})
