import process from 'node:process'
import { eq } from 'drizzle-orm'
import { invalidateSessions } from '~/server/services/auth'
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

  if (!subscriptionId) {
    if (process.env.RUNTIME_ENV === 'dev')
      console.warn('User does not have a subscription. Skipping stripe subscription pause in dev environment')
    else
      throw internal('User does not have a subscription')
  }

  if (subscriptionId)
    await pauseStripeSubscription(stripe, subscriptionId)

  await orm.update(users).set({
    deactivatedAt: now(),
    updatedAt: now(),
  }).where(eq(users.id, user.id!))

  await invalidateSessions(orm, user.id)

  return sendRedirect(event, '/deactivated-account')
})
