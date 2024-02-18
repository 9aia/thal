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
import { notFound } from "#framework/utils/httpThrowers";
import { verifyAuthentication } from "#framework/middlewares/verifyAuthentication";
import Stripe from "stripe";

const createSessionRoutes = new Hono<ApiContext>();

export default createSessionRoutes
  .get("/stripe/redirect/:type", zValidator("param", z.object({
    type: z.enum(['success', 'canceled'])
  })), async (c) => {
    const { type } = c.req.valid('param')

    const url = `${APP_URL}/checkout/${type}`

    return c.html(`<meta http-equiv="refresh" content="1;URL='${url}'" />`)
  })
  .get("/stripe/create-checkout-session", verifyAuthentication({ redirect: true, redirectType: 'pricing' }), async (c) => {
    const { STRIPE_SECRET_KEY } = env(c);
    const orm = c.get("orm");

    const stripe = getStripe({ stripeKey: STRIPE_SECRET_KEY });

    const lookup_key = "premium"

    const session = c.get('session')

    const [ user ] = await orm.select().from(users).where(eq(users.id, session.user.userId))

    if (!user) {
      throw notFound("User not found")
    }

    if (getCookie(c, 'free_trial_used') === '1' && user.free_trial_used !== 1) {
      return c.redirect('/plan/pending')
    }

    const prices = await stripe.prices.list({
      lookup_keys: [lookup_key],
      expand: ['data.product'],
    });

    const checkoutData: Stripe.Checkout.SessionCreateParams = {
      billing_address_collection: 'auto',
      line_items: [
        {
          price: prices.data[0].id,
          quantity: 1,
        },
      ],
      client_reference_id: session.user.userId,
      mode: 'subscription',
      success_url: `${APP_URL}/api/payment/stripe/redirect/success`,
      cancel_url: `${APP_URL}/api/payment/stripe/redirect/canceled`,
    }

    const hasTrialBeenUsed = user.free_trial_used === 1

    if (!hasTrialBeenUsed) {
      checkoutData.subscription_data = {
        trial_period_days: 7,
        trial_settings: {
          end_behavior: {
            missing_payment_method: 'cancel',
          }
        }
      }

      checkoutData.payment_method_collection = 'if_required'
    }

    const checkoutSession = await stripe.checkout.sessions.create(checkoutData);

    await orm.update(users).set({
      payment_gateway_session_id: checkoutSession.id
    }).where(eq(users.id, session.user.userId))

    return c.redirect(checkoutSession.url!);
  })
  .get("/stripe/create-portal-session", verifyAuthentication({ redirect: true }), async (c) => {
    const { STRIPE_SECRET_KEY } = env(c);
    const orm = c.get("orm");

    const session = c.get('session')

    const user = (await orm.select().from(users).where(eq(users.id, session.user.userId))).at(0)

    if (!user) {
      throw notFound("User not found")
    }

    const stripe = getStripe({ stripeKey: STRIPE_SECRET_KEY });
    const checkoutSession = await stripe.checkout.sessions.retrieve(user.payment_gateway_session_id as string);

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: checkoutSession.customer as string,
      return_url: APP_URL,
    });

    return c.redirect(portalSession.url);
  });
