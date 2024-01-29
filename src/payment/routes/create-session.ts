import { ApiContext } from "#framework/api";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { getStripe } from "../utils/stripe";
import { APP_URL } from '../../../public_keys.json';
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { users } from "~/auth/schemas/auth.schemas";
import { eq } from "drizzle-orm";
import { getCookie } from "hono/cookie";

const createSessionRoutes = new Hono<ApiContext>();

export default createSessionRoutes
  .get("/stripe/redirect/:type", zValidator("param", z.object({
    type: z.enum(['success', 'canceled'])
  })), async (c) => {
    const { type } = c.req.valid('param')

    const url = `${APP_URL}/checkout/${type}`

    return c.html(`<meta http-equiv="refresh" content="1;URL='${url}'" />`)
  })
  .post("/stripe/create-checkout-session", async (c) => {
    const { STRIPE_SECRET_KEY } = env(c);
    const orm = c.get("orm");

    const sessionId = getCookie(c, 'auth_session') as string

    const { lucia } = c.get('auth')
    const auth = await lucia.validateSession(sessionId)

    const stripe = getStripe({ stripeKey: STRIPE_SECRET_KEY });

    const data = await c.req.formData();
    const lookup_key = data.get('lookup_key') as string;

    const prices = await stripe.prices.list({
      lookup_keys: [lookup_key],
      expand: ['data.product'],
    });

    const session = await stripe.checkout.sessions.create({
      billing_address_collection: 'auto',
      line_items: [
        {
          price: prices.data[0].id,
          quantity: 1,
        },
      ],
      client_reference_id: auth.user.userId,
      mode: 'subscription',
      success_url: `${APP_URL}/api/payment/stripe/redirect/success`,
      cancel_url: `${APP_URL}/api/payment/stripe/redirect/canceled`,
    });

    await orm.update(users).set({
      payment_gateway_session_id: session.id
    }).where(eq(users.id, auth.user.userId))

    return c.redirect(session.url!);
  })
  .get("/stripe/create-portal-session", async (c) => {
    const { STRIPE_SECRET_KEY } = env(c);
    const orm = c.get("orm");
    const sessionId = getCookie(c, 'auth_session') as string

    const { lucia } = c.get('auth')
    const auth = await lucia.validateSession(sessionId)

    const user = (await orm.select().from(users).where(eq(users.id, auth.user.userId))).at(0)

    if(!user) {
      throw new Error('User not found')
    }

    const stripe = getStripe({ stripeKey: STRIPE_SECRET_KEY });
    const checkoutSession = await stripe.checkout.sessions.retrieve(user.payment_gateway_session_id as string);

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: checkoutSession.customer as string,
      return_url: APP_URL,
    });

    return c.redirect(portalSession.url);
  });
