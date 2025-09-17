import Stripe from 'stripe'

export function getStripe({ stripeKey }: { stripeKey: string }) {
  if (!stripeKey)
    throw internal('Can not initialize Stripe without stripe key')

  const client = new Stripe(stripeKey, {
    httpClient: Stripe.createFetchHttpClient(),
  })
  return client
}
