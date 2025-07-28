import { block } from '@9aia/castor'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { now } from '~~/app/utils/date'
import { PlanType, SubscriptionStatus, users } from '~~/db/schema'

block('Update subscription status for all users', {
  schema: z.object({
    status: z.enum(['active', 'trialing', 'incomplete', 'incomplete_expired', 'paused', 'canceled', 'unpaid', 'past_due', 'not_subscribed']),
  }),
  query: (db, input) => db.update(users).set({
    subscriptionStatus: SubscriptionStatus[input.status],
    updatedAt: now(),
  }).returning(),
})

block('Add fake plan for all users', {
  query: db => db.update(users).set({
    plan: PlanType.STANDARD_MONTHLY,
    subscriptionStatus: SubscriptionStatus.active,
    updatedAt: now(),
  }).returning(),
})

block('Select subscription data from all users', {
  query: db => db.select({
    id: users.id,
    plan: users.plan,
    stripeCustomerId: users.stripeCustomerId,
    subscriptionId: users.subscriptionId,
    subscriptionStatus: users.subscriptionStatus,
    freeTrialUsed: users.freeTrialUsed,
    checkoutId: users.checkoutId,
  }).from(users),
})

block('Remove plan from all users', {
  query: db => db.update(users).set({
    plan: null,
    stripeCustomerId: null,
    subscriptionId: null,
    subscriptionStatus: SubscriptionStatus.not_subscribed,
    freeTrialUsed: false,
    checkoutId: null,
    updatedAt: now(),
  }).returning(),
})

block('Remove plan from user by id', {
  schema: z.string(),
  query: (db, input) => db.update(users).set({
    plan: null,
    stripeCustomerId: null,
    subscriptionId: null,
    subscriptionStatus: SubscriptionStatus.not_subscribed,
    freeTrialUsed: false,
    checkoutId: null,
    updatedAt: now(),
  }).where(eq(users.id, input)).returning(),
})
