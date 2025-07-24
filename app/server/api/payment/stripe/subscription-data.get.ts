import { badRequest, internal, unauthorized } from '~/utils/nuxt'
import { getStripe } from '~/utils/stripe'

export default defineEventHandler(async (event) => {
  const { STRIPE_SECRET_KEY } = useRuntimeConfig(event)

  if (!STRIPE_SECRET_KEY)
    throw internal('STRIPE_SECRET_KEY is not set in the environment')

  const user = event.context.user

  if (!user)
    return unauthorized('User is not authenticated')

  const subscriptionId = user?.subscriptionId

  if (!subscriptionId) {
    throw badRequest('User does not have a subscription')
  }

  const stripe = getStripe({ stripeKey: STRIPE_SECRET_KEY! })

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  return {
    cameFromCheckoutInTrialMode: !!subscription.trial_end,
  }
})
