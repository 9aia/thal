import process from "node:process"
import { eq } from "drizzle-orm"
import type Stripe from "stripe"
import { users } from "~/src/base/server/db/schema"
import { getAppUrl } from "~/src/base/utils/h3"
import { PLANS } from "~/src/payment/constants/plans"

export default eventHandler(async (event) => {
  const { STRIPE_SECRET_KEY } = process.env

  const orm = event.context.orm
  const user = event.context.user

  if (!user)
    return sendRedirect(event, "/sign-in")

  const stripe = getStripe({ stripeKey: STRIPE_SECRET_KEY! })

  if (getCookie(event, "free_trial_used") === "1")
    return sendRedirect(event, "/plan/pending")

  const prices = await stripe.prices.list({
    lookup_keys: [PLANS.premium.lookupKey],
    expand: ["data.product"],
  })

  const appUrl = getAppUrl(event).toString()
  const successUrl = new URL("/checkout/success", appUrl)
  const cancelUrl = new URL("/checkout/cancel", appUrl)

  const checkoutCreateParams: Stripe.Checkout.SessionCreateParams = {
    billing_address_collection: "auto",
    line_items: [
      {
        price: prices.data[0].id,
        quantity: 1,
      },
    ],
    client_reference_id: user.id,
    mode: "subscription",
    success_url: successUrl.toString(),
    cancel_url: cancelUrl.toString(),
    customer_email: user.email || undefined,
  }

  const hasTrialBeenUsed = user.free_trial_used === 1

  if (!hasTrialBeenUsed) {
    checkoutCreateParams.subscription_data = {
      trial_period_days: 7,
      trial_settings: {
        end_behavior: {
          missing_payment_method: "cancel",
        },
      },
    }

    checkoutCreateParams.payment_method_collection = "if_required"
  }

  const checkout = await stripe.checkout.sessions.create(checkoutCreateParams)

  await orm.update(users).set({
    payment_gateway_session_id: checkout.id,
  }).where(eq(users.id, user.id))

  return sendRedirect(event, checkout.url!)
})
