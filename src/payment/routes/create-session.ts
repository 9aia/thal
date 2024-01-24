import { ApiContext } from "#framework/api";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { getStripe } from "../utils/stripe";

const createSessionRoutes = new Hono<ApiContext>();

export default createSessionRoutes
  .post("/stripe/create-checkout-session", async (c) => {
    const { STRIPE_SECRET_KEY } = env(c);
    const URL_START = 'https://maratongue.com/checkout/';

    const stripe = getStripe({ stripeKey: STRIPE_SECRET_KEY });

    const { lookup_key } = await c.req.json();

    const prices = await stripe.prices.list({
      lookup_keys: [lookup_key],
      expand: ['data.product'],
    });
    const session = await stripe.checkout.sessions.create({
      billing_address_collection: 'auto',
      line_items: [
        {
          price: prices.data[0].id,
          // For metered billing, do not pass quantity
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${URL_START}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${URL_START}/cancel.html`,
      subscription_data: {
        billing_cycle_anchor: 1672531200,
      },
      automatic_tax: { enabled: true },
    });
  
    return c.redirect(session.url!);
  })
  .post("/stripe/create-portal-session", async (c) => {
    const { STRIPE_SECRET_KEY } = env(c);

    const stripe = getStripe({ stripeKey: STRIPE_SECRET_KEY });

    // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
    // Typically this is stored alongside the authenticated user in your database.
    const { session_id } = await c.req.json();
    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

    // This is the url to which the customer will be redirected when they are done managing their billing with the portal.
    const returnUrl = 'YOUR_DOMAIN';

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: checkoutSession.customer as string,
      return_url: returnUrl,
    });

    return c.redirect(portalSession.url);
  });
