import { and, eq } from 'drizzle-orm'
import type { DrizzleD1Database } from 'drizzle-orm/d1'
import type Stripe from 'stripe'
import type { PlanSettings } from '~/types'
import { internal } from '~/utils/nuxt'
import type { User } from '~~/db/schema'
import { PlanType, SubscriptionStatus, users } from '~~/db/schema'

export async function updateSubscription(
  orm: DrizzleD1Database<any>,
  subscription: Stripe.Subscription,
) {
  const userId = subscription.metadata.userId

  if (!userId) {
    throw internal('User not found')
  }

  await orm
    .update(users)
    .set({
      subscriptionStatus: SubscriptionStatus[subscription.status],
      stripeCustomerId: subscription.customer as string,
      subscriptionId: subscription.id,
      plan: PlanType.ALL_IN_ONE,
    })
    .where(and(eq(users.id, userId), eq(users.subscriptionId, subscription.id)))
}

export async function createSubscription(
  orm: DrizzleD1Database<any>,
  subscription: Stripe.Subscription,
) {
  const userId = subscription.metadata.userId

  if (!userId) {
    throw internal('User not found')
  }

  await orm
    .update(users)
    .set({
      subscriptionStatus: SubscriptionStatus[subscription.status],
      stripeCustomerId: subscription.customer as string,
      subscriptionId: subscription.id,
      plan: PlanType.ALL_IN_ONE,
    })
    .where(eq(users.id, userId))
}

export async function deletedSubscription(
  orm: DrizzleD1Database<any>,
  subscription: Stripe.Subscription,
) {
  const userId = subscription.metadata.userId

  if (!userId) {
    throw internal('User not found')
  }

  await orm
    .update(users)
    .set({
      subscriptionStatus: SubscriptionStatus[subscription.status],
      stripeCustomerId: subscription.customer as string,
      subscriptionId: subscription.id,
      plan: null,
    })
    .where(and(eq(users.id, userId), eq(users.subscriptionId, subscription.id)))
}

// export async function activePlan(
//   orm: DrizzleD1Database<any>,
//   userId: string,
//   paymentGatewayCustomerId: string,
//   plan: PlanType,
// ) {
//   const user = (await orm.select().from(users).where(eq(users.id, userId))).at(0)

//   if (!user)
//     throw notFound(`User not found: ${userId}`)

//   const expirationDate = now()

//   if (user.free_trial_used === 0)
//     expirationDate.setDate(expirationDate.getDate() + 7)
//   else
//     expirationDate.setMonth(expirationDate.getMonth() + 1)

//   await orm
//     .update(users)
//     .set({
//       plan: plan.lookupKey,
//       payment_gateway_customer_id: paymentGatewayCustomerId,
//       plan_expires: expirationDate.toISOString(),
//       free_trial_used: 1,
//     })
//     .where(eq(users.id, userId))
// }

// export async function cancelSubscription(
//   orm: DrizzleD1Database<any>,
//   paymentGatewayCustomerId: string,
// ) {
//   await orm
//     .update(users)
//     .set({
//       plan: null,
//       payment_gateway_customer_id: null,
//       plan_expires: null,
//     })
//     .where(eq(users.payment_gateway_customer_id, paymentGatewayCustomerId))
// }

// export async function updateSubscription(
//   orm: DrizzleD1Database<any>,
//   paymentGatewayCustomerId: string,
//   planExpiresAt?: string,
// ) {
//   const values: SQLiteUpdateSetSource<typeof users> = {}

//   if (planExpiresAt)
//     values.plan_expires = planExpiresAt

//   await orm
//     .update(users)
//     .set(values)
//     .where(eq(users.payment_gateway_customer_id, paymentGatewayCustomerId))
// }

export async function pauseStripeSubscription(stripe: Stripe, subscriptionId: string) {
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

// export async function resumeSubscription(stripe: Stripe, subscriptionId: string) {
//   try {
//     await stripe.subscriptions.update(subscriptionId, {
//       pause_collection: null,
//     })
//   }
//   catch (_e) {
//     const _ = _e
//     throw internal('Error resuming subscription')
//   }
// }

export async function getCheckoutStatus(stripe: Stripe, user?: User | null) {
  if (!user || !user?.checkoutId) {
    return null
  }

  const checkout = await stripe.checkout.sessions.retrieve(user.checkoutId)

  if (checkout.status === 'complete') {
    return 'complete'
  }
  else if (checkout.status === 'open' && user.subscriptionStatus === SubscriptionStatus.not_subscribed) {
    return 'open'
  }

  return null
}

export async function getPrice(stripe: Stripe, planSettings: PlanSettings) {
  const prices = await stripe.prices.list({
    lookup_keys: [planSettings.lookupKey],
    expand: ['data.product'],
  })

  if (prices.data.length) {
    return (prices.data[0].unit_amount || 0) / 100
  }

  return null
}
