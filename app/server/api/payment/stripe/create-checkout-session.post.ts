import { eq } from 'drizzle-orm'
import type Stripe from 'stripe'
import { SubscriptionStatus, users } from '~~/db/schema'
import { getAppUrl } from '~/utils/h3'
import { PLANS } from '~/constants/payment'
import { getStripe } from '~/utils/stripe'
import { internal } from '~/utils/nuxt'

export default eventHandler(async (event) => {
  const { STRIPE_SECRET_KEY } = useRuntimeConfig(event)

  if (!STRIPE_SECRET_KEY)
    throw internal('STRIPE_SECRET_KEY is not set in the environment')

  const user = event.context.user

  if (!user)
    return sendRedirect(event, '/sign-in')

  const stripe = getStripe({ stripeKey: STRIPE_SECRET_KEY! })

  if (user.checkoutId) {
    const checkout = await stripe.checkout.sessions.retrieve(user.checkoutId)

    if (checkout.status === 'complete') {
      return sendRedirect(event, '/checkout/success')
    }

    if (checkout.status === 'open' && user.subscriptionStatus === SubscriptionStatus.not_subscribed) {
      return sendRedirect(event, checkout.url!)
    }
  }

  const prices = await stripe.prices.list({
    lookup_keys: [PLANS.allInOne.lookupKey],
    expand: ['data.product'],
  })

  const appUrl = getAppUrl(event).toString()
  const successUrl = new URL('/checkout/success', appUrl)
  const cancelUrl = new URL('/checkout/cancel', appUrl)

  const subscription_data: Stripe.Checkout.SessionCreateParams.SubscriptionData = {
    metadata: {
      userId: user.id,
    },
  }

  const checkoutCreateParams: Stripe.Checkout.SessionCreateParams = {
    billing_address_collection: 'auto',
    line_items: [
      {
        price: prices.data[0].id,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl.toString(),
    cancel_url: cancelUrl.toString(),
    customer_email: user.email || undefined,
    subscription_data,

  }

  const hasTrialBeenUsed = user.freeTrialUsed

  if (!hasTrialBeenUsed) {
    checkoutCreateParams.subscription_data = {
      trial_period_days: PLANS.allInOne.trialPeriodDays,
      trial_settings: {
        end_behavior: {
          missing_payment_method: 'cancel',
        },
      },
      ...subscription_data,
    }

    checkoutCreateParams.payment_method_collection = 'if_required'
  }

  const checkout = await stripe.checkout.sessions.create(checkoutCreateParams)

  const orm = event.context.orm
  await orm.update(users).set({
    checkoutId: checkout.id,
  }).where(eq(users.id, user.id))

  return sendRedirect(event, checkout.url!)
})
