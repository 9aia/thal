import Stripe from 'stripe'
import { createSubscription, deletedSubscription, updateSubscription } from '~/server/services/plan'
import { badRequest, internal } from '~/utils/nuxt'
import { getStripe } from '~/utils/stripe'

export default eventHandler(async (event) => {
  const { STRIPE_ENDPOINT_SECRET, STRIPE_SECRET_KEY } = useRuntimeConfig(event)

  if (!STRIPE_ENDPOINT_SECRET || !STRIPE_SECRET_KEY)
    throw internal('Stripe environment variables not set')

  const stripe = getStripe({ stripeKey: STRIPE_SECRET_KEY! })
  const body = await readRawBody(event) as string
  const sig = getRequestHeaders(event)['stripe-signature']!

  let stripeEvent: Stripe.Event

  try {
    stripeEvent = await stripe.webhooks.constructEventAsync(
      body,
      sig,
      STRIPE_ENDPOINT_SECRET!,
      undefined,
      Stripe.createSubtleCryptoProvider(),
    )
  }
  catch (err) {
    const errorMessage = `⚠️  Webhook signature verification failed. ${
      err instanceof Error ? err.message : 'Internal server error'
    }`
    console.error(errorMessage)

    throw badRequest(errorMessage)
  }

  const orm = event.context.orm

  const eventsOptions: Partial<Record<typeof stripeEvent.type, () => Promise<void>>> = {
    'customer.subscription.created': async () => {
      const subscription = stripeEvent.data.object as Stripe.Subscription
      await createSubscription(orm, subscription as Stripe.Subscription)
    },
    'customer.subscription.updated': async () => {
      const subscription = stripeEvent.data.object as Stripe.Subscription
      await updateSubscription(orm, subscription as Stripe.Subscription)
    },
    'customer.subscription.trial_will_end': async () => {
      const subscription = stripeEvent.data.object as Stripe.Subscription
      await updateSubscription(orm, subscription as Stripe.Subscription)
    },
    'customer.subscription.deleted': async () => {
      const subscription = stripeEvent.data.object as Stripe.Subscription
      await deletedSubscription(orm, subscription as Stripe.Subscription)
    },
  }

  const handler = eventsOptions[stripeEvent.type]

  if (handler)
    await handler()

  return { received: true }
})
