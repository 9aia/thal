import process from "node:process"
import { getAppUrl } from "~/src/base/utils/h3"
import { notFound } from "~/src/base/utils/nuxt"

export default eventHandler(async (event) => {
  const { STRIPE_SECRET_KEY } = process.env

  const user = event.context.user

  if (!user)
    return sendRedirect(event, "/sign-in")

  if (!user.payment_gateway_session_id)
    throw notFound(`Payment gateway session not found`)

  const stripe = getStripe({ stripeKey: STRIPE_SECRET_KEY! })

  const checkout = await stripe.checkout.sessions.retrieve(user.payment_gateway_session_id as string)
  const redirectUrl = getCookie(event, "redirect_url") || "/"
  const returnUrl = new URL(redirectUrl, getAppUrl(event))

  const portal = await stripe.billingPortal.sessions.create({
    customer: checkout.customer as string,
    return_url: returnUrl.toString(),
  })

  return sendRedirect(event, portal.url)
})
