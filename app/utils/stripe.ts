import Stripe from 'stripe'
import { PLANS } from '~/constants/payment'

export function getStripe({ stripeKey }: { stripeKey: string }) {
  if (!stripeKey)
    throw internal('Can not initialize Stripe without stripe key')

  const client = new Stripe(stripeKey, {
    httpClient: Stripe.createFetchHttpClient(),
  })
  return client
}

export function getPlan(session: Stripe.Checkout.Session) {
  return Object.values(PLANS).find(
    plan => plan.amount === session.amount_subtotal,
  )
}
