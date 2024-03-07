export default eventHandler(async (event) => {
  const { STRIPE_SECRET_KEY } = process.env

  const user = event.context.user

  if(!user) {
    return sendRedirect(event, '/sign-in')
  }

  const stripe = getStripe({ stripeKey: STRIPE_SECRET_KEY! })

  if (!user.payment_gateway_session_id) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Payment gateway session not found'
    })
  }

  const checkout = await stripe.checkout.sessions.retrieve(user.payment_gateway_session_id as string)  
  const redirectUrl = getCookie(event, 'redirect_url')

  const portal = await stripe.billingPortal.sessions.create({
    customer: checkout.customer as string,
    return_url: redirectUrl,
  })

  return sendRedirect(event, portal.url)
})
