import Stripe from 'stripe'
import * as stripeHandlers from '../../../handlers/stripe'
import { getStripe } from '~/utils/stripe'
import { badRequest, internal } from '~/utils/nuxt'

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

  const eventsOptions: Partial<Record<typeof stripeEvent.type, () => Promise<void>>> = {
    'customer.subscription.created': async () => {
      await stripeHandlers.handleSubscriptionCreated(event, stripeEvent as Stripe.CustomerSubscriptionCreatedEvent)
    },
    'customer.subscription.updated': async () => {
      await stripeHandlers.handleSubscriptionUpdated(event, stripeEvent as Stripe.CustomerSubscriptionUpdatedEvent)
    },
    'customer.subscription.trial_will_end': async () => {
      await stripeHandlers.handleSubscriptionTrialWillEnd(event, stripeEvent as Stripe.CustomerSubscriptionTrialWillEndEvent)
    },
    'customer.subscription.deleted': async () => {
      await stripeHandlers.handleSubscriptionDeleted(event, stripeEvent as Stripe.CustomerSubscriptionDeletedEvent)
    },
  }

  const handler = eventsOptions[stripeEvent.type]

  if (handler)
    await handler()

  return { received: true }
})
