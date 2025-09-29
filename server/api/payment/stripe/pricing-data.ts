import { SUBSCRIPTION_PLANS } from '#shared/constants/payment'
import { getCheckoutStatus, getPrice } from '~~/server/services/plan'
import { internal } from '~~/server/utils/nuxt'
import { getStripe } from '~~/server/utils/stripe'

export default eventHandler(async (event) => {
  const { STRIPE_SECRET_KEY } = useRuntimeConfig(event)

  if (!STRIPE_SECRET_KEY)
    throw internal('STRIPE_SECRET_KEY is not set in the environment')

  const stripe = getStripe({ stripeKey: STRIPE_SECRET_KEY! })

  const price = await getPrice(stripe, SUBSCRIPTION_PLANS.STANDARD_MONTHLY)
  const user = event.context.user
  const checkoutStatus = await getCheckoutStatus(stripe, user)

  return {
    checkoutStatus,
    subscriptionStatus: user?.subscriptionStatus,
    price,
  }
})
