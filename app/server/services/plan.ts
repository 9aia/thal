import { and, eq } from 'drizzle-orm'
import type { DrizzleD1Database } from 'drizzle-orm/d1'
import type Stripe from 'stripe'
import type { CheckoutStatus, PlanSettings } from '~/types'
import { internal } from '~/utils/nuxt'
import type { User, UserSelect } from '~~/db/schema'
import { PlanType, SubscriptionStatus, users } from '~~/db/schema'

export async function updateSubscription(
  orm: DrizzleD1Database<any>,
  subscription: Stripe.Subscription,
) {
  const userId = subscription.metadata.userId

  if (!userId) {
    throw internal('User not found')
  }

  const subscriptionData: Partial<UserSelect> = {
    subscriptionStatus: SubscriptionStatus[subscription.status],
    stripeCustomerId: subscription.customer as string,
    subscriptionId: subscription.id,
    plan: PlanType.ALL_IN_ONE,
  }

  if (subscription.status === 'trialing') {
    subscriptionData.freeTrialUsed = 1
  }

  await orm
    .update(users)
    .set(subscriptionData)
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

  const subscriptionData: Partial<UserSelect> = {
    subscriptionStatus: SubscriptionStatus[subscription.status],
    stripeCustomerId: subscription.customer as string,
    subscriptionId: subscription.id,
    plan: PlanType.ALL_IN_ONE,
  }

  if (subscription.status === 'trialing') {
    subscriptionData.freeTrialUsed = 1
  }

  await orm
    .update(users)
    .set(subscriptionData)
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
      checkoutId: null,
      plan: null,
    })
    .where(and(eq(users.id, userId), eq(users.subscriptionId, subscription.id)))
}

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

export async function getStatus(stripe: Stripe, user?: User | null) {
  if (!user || !user?.checkoutId) {
    return null
  }

  const checkout = await stripe.checkout.sessions.retrieve(user.checkoutId, {
    expand: ['subscription'],
  })
  const subscription = checkout.subscription as Stripe.Subscription
  const subscriptionStatus = SubscriptionStatus[subscription?.status || '']

  if (checkout.status === 'complete') {
    return {
      checkoutStatus: 'complete' as CheckoutStatus,
      subscriptionStatus,
    }
  }
  else if (checkout.status === 'open' && !user.subscriptionId) {
    return {
      checkoutStatus: 'open' as CheckoutStatus,
      subscriptionStatus: SubscriptionStatus.not_subscribed,
    }
  }

  return {
    checkoutStatus: null as CheckoutStatus,
    subscriptionStatus,
  }
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
