import Stripe from 'stripe'
import { deletedSubscription, handleChargeRefunded, updateSubscription } from '~~/server/services/plan'
import { badRequest, internal } from '~~/server/utils/nuxt'
import { getStripe } from '~~/server/utils/stripe'

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

  // TODO:
  // For the invoice.payment_succeeded event, you can update the subscription status in your database, grant access to premium features, or notify the user about the successful payment.

  switch (stripeEvent.type) {
    case 'invoice.paid': {
      const invoice = stripeEvent.data.object as Stripe.Invoice

      const subscriptionId = invoice.parent?.subscription_details?.subscription as string

      if (!subscriptionId) {
        throw internal('No subscription ID found in invoice')
      }

      const subscription = await stripe.subscriptions.retrieve(subscriptionId)

      await updateSubscription(orm, subscription)
      break
    }
    case 'customer.subscription.updated':
    case 'customer.subscription.trial_will_end': {
      const subscription = stripeEvent.data.object as Stripe.Subscription
      await updateSubscription(orm, subscription)
      break
    }
    // TODO: For the customer.subscription.deleted event, you can revoke access to premium features, update the user's subscription status, or send a cancellation confirmation email.
    case 'customer.subscription.deleted': {
      const subscription = stripeEvent.data.object as Stripe.Subscription
      await deletedSubscription(orm, subscription)
      break
    }
    case 'charge.refunded': {
      const charge = stripeEvent.data.object as Stripe.Charge
      await handleChargeRefunded(event, orm, charge)
      break
    }
  }

  return { received: true }
})
