import { eq } from 'drizzle-orm'
import type Stripe from 'stripe'
import { SUBSCRIPTION_PLANS } from '~/constants/payment'
import { now } from '#shared/utils/date'
import { getAppUrl } from '~~/server/utils/h3'
import { internal } from '~~/server/utils/nuxt'
import { getStripe } from '~~/server/utils/stripe'
import { SubscriptionStatus, users } from '~~/server/db/schema'

export default eventHandler(async (event) => {
  const { STRIPE_SECRET_KEY } = useRuntimeConfig(event)

  if (!STRIPE_SECRET_KEY)
    throw internal('STRIPE_SECRET_KEY is not set in the environment')

  const user = event.context.user

  if (!user)
    return sendRedirect(event, '/sign-in')

  const stripe = getStripe({ stripeKey: STRIPE_SECRET_KEY! })

  // TODO: refactor: move this condition inside the places where we redirect to the checkout page
  if (user.checkoutId) {
    const checkout = await stripe.checkout.sessions.retrieve(user.checkoutId)

    if (checkout.status === 'complete') {
      return sendRedirect(event, '/app')
    }

    if (checkout.status === 'open' && user.subscriptionStatus === SubscriptionStatus.not_subscribed) {
      return sendRedirect(event, checkout.url!)
    }
  }

  const appUrl = getAppUrl(event).toString()
  const successUrl = new URL('/app', appUrl)
  const cancelUrl = new URL(getCookie(event, 'redirect_url') || '/app', appUrl)
  const query = new URLSearchParams(cancelUrl.search)
  query.set('checkout-cancel', 'true')
  cancelUrl.search = query.toString()

  const subscription_data: Stripe.Checkout.SessionCreateParams.SubscriptionData = {
    metadata: {
      userId: user.id,
    },
  }

  const prices = await stripe.prices.list({
    lookup_keys: [SUBSCRIPTION_PLANS.STANDARD_MONTHLY.priceLookupKey],
    expand: ['data.product'],
  })

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
    subscription_data,
  }

  const stripeCustomerId = user.stripeCustomerId

  if (stripeCustomerId) {
    checkoutCreateParams.customer = stripeCustomerId
  }
  else {
    checkoutCreateParams.customer_email = user.email || undefined
  }

  const hasTrialBeenUsed = user.freeTrialUsed

  if (!hasTrialBeenUsed) {
    checkoutCreateParams.subscription_data = {
      trial_period_days: SUBSCRIPTION_PLANS.STANDARD_MONTHLY.trialPeriodDays,
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
    updatedAt: now(),
  }).where(eq(users.id, user.id))

  return sendRedirect(event, checkout.url!)
})
