import { PLANS } from '~/constants/payment'
import { getPrice, getStatus } from '~/server/services/plan'
import { internal } from '~/utils/nuxt'
import { getStripe } from '~/utils/stripe'

export default eventHandler(async (event) => {
  const { STRIPE_SECRET_KEY } = useRuntimeConfig(event)

  if (!STRIPE_SECRET_KEY)
    throw internal('STRIPE_SECRET_KEY is not set in the environment')

  const stripe = getStripe({ stripeKey: STRIPE_SECRET_KEY! })

  const price = await getPrice(stripe, PLANS.allInOne)
  const user = event.context.user
  const status = await getStatus(stripe, user)

  return {
    checkoutStatus: status?.checkoutStatus,
    subscriptionStatus: user?.subscriptionStatus,
    price,
  }
})
