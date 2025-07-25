import { getCheckoutStatus } from '~/server/services/plan'
import { internal, unauthorized } from '~/utils/nuxt'
import { getStripe } from '~/utils/stripe'

export default defineEventHandler(async (event) => {
  const { STRIPE_SECRET_KEY } = useRuntimeConfig(event)

  if (!STRIPE_SECRET_KEY)
    throw internal('STRIPE_SECRET_KEY is not set in the environment')

  const user = event.context.user

  if (!user)
    throw unauthorized('User is not authenticated')

  const subscriptionId = user?.subscriptionId

  if (!subscriptionId) {
    return {
      cameFromCheckoutInTrialMode: false,
      processingTrialActivation: false,
    }
  }

  const stripe = getStripe({ stripeKey: STRIPE_SECRET_KEY! })

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  const checkoutStatus = await getCheckoutStatus(stripe, user)

  return {
    cameFromCheckoutInTrialMode: !!subscription.trial_end,
    processingTrialActivation: checkoutStatus === 'complete' && !user.plan && !user.freeTrialUsed,
  }
})
