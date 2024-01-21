import { Hono } from "hono";

export default new Hono().post("/stripe", async (c) => {
  const data = await c.req.json()

  const userId = data?.data?.object?.client_reference_id

  const eventsOptions: Record<string, any> = {
    'payment_intent.succeeded': async () => {
      console.log('payment_intent.succeeded', userId)
    },
    'subscription_schedule.canceled': async () => {
      console.log('payment_intent.succeeded', userId)
    },
    'invoice.upcoming': async () => {
      console.log('invoice.upcoming', userId)
    },
    'charge.captured': async () => {
      console.log('charge.captured', userId)
    },
    'invoice.payment_succeeded': async () => {
      console.log('invoice.payment_succeeded', userId)
    }
  }

  eventsOptions[data.type]?.()

  return c.json({ message: "Received!" });
});
