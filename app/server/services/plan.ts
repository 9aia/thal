import { eq } from 'drizzle-orm'
import type { SQLiteUpdateSetSource } from 'drizzle-orm/sqlite-core'
import type { DrizzleD1Database } from 'drizzle-orm/d1'
import type Stripe from 'stripe'
import type { User } from '~~/db/schema'
import { users } from '~~/db/schema'
import { internal, notFound } from '~/utils/nuxt'
import type { PlanType } from '~/types'
import { now } from '~/utils/date'

export async function activePlan(
  orm: DrizzleD1Database<any>,
  userId: string,
  paymentGatewayCustomerId: string,
  plan: PlanType,
) {
  const user = (await orm.select().from(users).where(eq(users.id, userId))).at(0)

  if (!user)
    throw notFound(`User not found: ${userId}`)

  const expirationDate = now()

  if (user.free_trial_used === 0)
    expirationDate.setDate(expirationDate.getDate() + 7)
  else
    expirationDate.setMonth(expirationDate.getMonth() + 1)

  await orm
    .update(users)
    .set({
      plan: plan.lookupKey,
      payment_gateway_customer_id: paymentGatewayCustomerId,
      plan_expires: expirationDate.toISOString(),
      free_trial_used: 1,
    })
    .where(eq(users.id, userId))
}

export async function cancelSubscription(
  orm: DrizzleD1Database<any>,
  paymentGatewayCustomerId: string,
) {
  await orm
    .update(users)
    .set({
      plan: null,
      payment_gateway_customer_id: null,
      plan_expires: null,
    })
    .where(eq(users.payment_gateway_customer_id, paymentGatewayCustomerId))
}

export async function updateSubscription(
  orm: DrizzleD1Database<any>,
  paymentGatewayCustomerId: string,
  planExpiresAt?: string,
) {
  const values: SQLiteUpdateSetSource<typeof users> = {}

  if (planExpiresAt)
    values.plan_expires = planExpiresAt

  await orm
    .update(users)
    .set(values)
    .where(eq(users.payment_gateway_customer_id, paymentGatewayCustomerId))
}

export async function getSubscriptionId(stripe: Stripe, user: User) {
  const customerId = user.payment_gateway_customer_id

  if (!customerId)
    throw internal('No customer ID found for user')

  let customer: Stripe.Customer | null = null

  try {
    customer = await stripe.customers.retrieve(customerId, {
      expand: ['subscriptions.data'],
    }) as Stripe.Customer
  }
  catch (_e) {
    const _ = _e
    throw internal('Error pausing subscription')
  }

  if (!customer.subscriptions || customer.subscriptions.data.length === 0) {
    throw internal('No subscription found for customer')
  }

  return customer.subscriptions.data[0].id
}

export async function pauseSubscription(stripe: Stripe, subscriptionId: string) {
  try {
    await stripe.subscriptions.update(subscriptionId, {
      pause_collection: {
        behavior: 'mark_uncollectible',
        resumes_at: undefined,
      },
    })
  }
  catch (_e) {
    const _ = _e
    throw internal('Error pausing subscription')
  }
}

export async function resumeSubscription(stripe: Stripe, subscriptionId: string) {
  try {
    await stripe.subscriptions.update(subscriptionId, {
      pause_collection: null,
    })
  }
  catch (_e) {
    const _ = _e
    throw internal('Error resuming subscription')
  }
}
