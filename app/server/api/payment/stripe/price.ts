import { PLANS } from '~/constants/payment'
import { internal, notFound } from '~/utils/nuxt'
import { getStripe } from '~/utils/stripe'

export default eventHandler(async (event) => {
  const { STRIPE_SECRET_KEY } = useRuntimeConfig(event)

  if (!STRIPE_SECRET_KEY)
    throw internal('STRIPE_SECRET_KEY is not set in the environment')

  const stripe = getStripe({ stripeKey: STRIPE_SECRET_KEY! })

  const prices = await stripe.prices.list({
    lookup_keys: [PLANS.allInOne.lookupKey],
    expand: ['data.product'],
  })

  if (!prices.data.length) {
    throw internal('Price not found')
  }

  return { amount: (prices.data[0].unit_amount || 0) / 100 }
})
