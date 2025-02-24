import { PLANS } from '~/constants/payment'
import { internal } from '~/utils/nuxt'
import { getStripe } from '~/utils/stripe'
import { SubscriptionStatus } from '~~/db/schema'

export default eventHandler(async (event) => {
  const { STRIPE_SECRET_KEY } = useRuntimeConfig(event)

  if (!STRIPE_SECRET_KEY)
    throw internal('STRIPE_SECRET_KEY is not set in the environment')

  const stripe = getStripe({ stripeKey: STRIPE_SECRET_KEY! })

  const prices = await stripe.prices.list({
    lookup_keys: [PLANS.allInOne.lookupKey],
    expand: ['data.product'],
  })

  let price = null

  if (prices.data.length) {
    price = (prices.data[0].unit_amount || 0) / 100
  }

  const user = event.context.user

  let checkoutStatus = null

  if (user && user.checkoutId) {
    const checkout = await stripe.checkout.sessions.retrieve(user.checkoutId)

    if (checkout.status === 'complete') {
      checkoutStatus = 'complete'
    }
    else if (checkout.status === 'open' && user.subscriptionStatus === SubscriptionStatus.not_subscribed) {
      checkoutStatus = 'open'
    }
  }

  console.log({
    checkoutStatus,
    price,
  })

  return {
    checkoutStatus,
    price,
  }
})
