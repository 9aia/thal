import process from 'node:process'
import Stripe from 'stripe'
import * as stripeHandlers from '../../../handlers/stripe'
import { getStripe } from '~/utils/stripe'
import { badRequest, internal } from '~/utils/nuxt'

export default eventHandler(async (event) => {
  const { STRIPE_ENDPOINT_SECRET, STRIPE_SECRET_KEY } = process.env

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
    'checkout.session.completed': async () => {
      await stripeHandlers.handleCheckoutCompleted(stripeEvent as any, event)
    },
    'checkout.session.async_payment_succeeded': async () => {
      await stripeHandlers.handleAsyncPaymentSucceeded(stripeEvent as any, event)
    },
    'customer.subscription.trial_will_end': async () => {},
    'customer.subscription.deleted': async () => {
      await stripeHandlers.handleCustomerSubscriptionDeleted(stripeEvent as any, event)
    },
    'customer.subscription.updated': async () => {
      await stripeHandlers.handleCustomerSubscriptionUpdated(stripeEvent as any, event)
    },
  }

  const handler = eventsOptions[stripeEvent.type]

  if (handler)
    await handler()

  return { received: true }
})
