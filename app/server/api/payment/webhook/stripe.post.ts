import Stripe from 'stripe'
import { createSubscription, deletedSubscription, handleChargeRefunded, updateSubscription } from '~/server/services/plan'
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
    // TODO:
    // For the invoice.payment_succeeded event, you can update the subscription status in your database, grant access to premium features, or notify the user about the successful payment.
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
    // TODO: For the customer.subscription.deleted event, you can revoke access to premium features, update the user’s subscription status, or send a cancellation confirmation email.
    'customer.subscription.deleted': async () => {
      const subscription = stripeEvent.data.object as Stripe.Subscription
      await deletedSubscription(orm, subscription as Stripe.Subscription)
    },
    'charge.refunded': async () => {
      const charge = stripeEvent.data.object as Stripe.Charge
      await handleChargeRefunded(event, orm, charge)
    },
  }

  const handler = eventsOptions[stripeEvent.type]

  if (handler)
    await handler()

  return { received: true }
})
