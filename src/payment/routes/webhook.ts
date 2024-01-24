import { ApiContext } from "#framework/api";
import { Hono } from "hono";
import { env } from "hono/adapter";
import * as stripeHandlers from "../handlers/stripe";
import { getStripe } from "../utils/stripe";
import Stripe from "stripe";

const webhookRoutes = new Hono<ApiContext>();

export default webhookRoutes.post("/stripe", async (c) => {
  const { STRIPE_SECRET_KEY } = env(c);

  const stripe = getStripe({ stripeKey: STRIPE_SECRET_KEY });
  const body = await c.req.text();
  const sig = c.req.raw.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      sig,
      STRIPE_SECRET_KEY,
      undefined,
      Stripe.createSubtleCryptoProvider()
    );
  } catch (err) {
    const errorMessage = `⚠️  Webhook signature verification failed. ${
      err instanceof Error ? err.message : "Internal server error"
    }`;
    console.log(errorMessage);

    return c.body(errorMessage, 400);
  }

  const eventsOptions: Partial<Record<typeof event.type, () => void>> = {
    "checkout.session.completed": async () => {
      stripeHandlers.handleCheckoutCompleted(event as any, c);
    },
    "checkout.session.async_payment_succeeded": async () => {
      stripeHandlers.handleAsyncPaymentSucceeded(event as any, c);
    },
    "customer.subscription.trial_will_end": () => {},
    "customer.subscription.deleted": async () => {
      stripeHandlers.handleCustomerSubscriptionDeleted(event as any, c);
    },
    "customer.subscription.created": () => {},
    "customer.subscription.updated": () => {},
  };

  const handler = eventsOptions[event.type];

  if (handler) {
    handler();
  } else {
    console.log(`Unhandled event type ${event.type}`);
  }

  return c.json({ received: true });
});
