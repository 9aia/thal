import { ApiContext } from "#framework/api";
import { Hono } from "hono";
import { StripeWebhookTypes } from "../types/stripeWebhookTypes";
import { PLANS } from "../constants/plans";
import { checkoutCompleted, subscriptionCanceled } from "../controllers/payments";

const webhookRoutes = new Hono<ApiContext>();

export default webhookRoutes.post("/stripe", async (c) => {
  const request = await c.req.json() as StripeWebhookTypes.Root

  const orm = c.get('orm')
  const eventObject = request.data.object

  const eventsOptions: Record<string, any> = {
    'checkout.session.completed': async () => {
      const stripeCustomerId = eventObject.customer
      const userId = eventObject.client_reference_id
      const plan = Object.values(PLANS).find(plan => plan.amount === eventObject.amount_subtotal)

      if (!userId) {
        throw new Error('userId not found')
      }

      if (!plan) {
        throw new Error('plan not found')
      }

      const isPaid = eventObject.payment_status === 'paid'

      await checkoutCompleted(
        orm,
        userId,
        stripeCustomerId,
        plan,
        isPaid,
      )
    },
    'checkout.session.async_payment_succeeded': async () => {
      const stripeCustomerId = eventObject.customer
      const userId = request.data.object.client_reference_id
      const plan = Object.values(PLANS).find(plan => plan.amount === eventObject.amount_subtotal)

      if (!userId) {
        throw new Error('userId not found')
      }

      if (!plan) {
        throw new Error('plan not found')
      }

      const isPaid = eventObject.payment_status === 'paid'

      await checkoutCompleted(
        orm,
        userId,
        stripeCustomerId,
        plan,
        isPaid,
      )
    },
    'customer.subscription.deleted': async () => {
      const stripeCustomerId = eventObject.customer

      if (!stripeCustomerId) {
        throw new Error('stripeCustomerId not found')
      }

      await subscriptionCanceled(orm, stripeCustomerId)
    }
  }

  if (eventsOptions.hasOwnProperty(request.type)) {
    eventsOptions[request.type]()
  }

  return c.json({ message: "Received" });
});
