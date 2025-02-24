import { getAppUrl } from '~/utils/h3'
import { internal, notFound } from '~/utils/nuxt'
import { getStripe } from '~/utils/stripe'

export default eventHandler(async (event) => {
  const { STRIPE_SECRET_KEY } = useRuntimeConfig(event)

  if (!STRIPE_SECRET_KEY)
    throw internal('STRIPE_SECRET_KEY is not set in the environment')

  const user = event.context.user

  if (!user)
    return sendRedirect(event, '/sign-in')

  if (!user.stripeCustomerId)
    throw internal('Stripe customer not found for user')

  const stripe = getStripe({ stripeKey: STRIPE_SECRET_KEY! })

  const redirectUrl = getCookie(event, 'redirect_url') || '/'
  const returnUrl = new URL(redirectUrl, getAppUrl(event))

  const portal = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: returnUrl.toString(),
  })

  return sendRedirect(event, portal.url)
})
