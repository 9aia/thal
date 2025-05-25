import { block } from '@9aia/castor'
import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { PlanType, SubscriptionStatus, users } from '~~/db/schema'

block('Add fake plan for all users', {
  query: db => db.update(users).set({
    plan: PlanType.ALL_IN_ONE,
    subscriptionStatus: SubscriptionStatus.active,
  }).returning(),
})

block('Remove plan from all users', {
  query: db => db.update(users).set({
    plan: null,
    stripeCustomerId: null,
    subscriptionId: null,
    subscriptionStatus: SubscriptionStatus.not_subscribed,
    checkoutId: null,
  }).returning(),
})

block('Remove plan from user by id', {
  schema: z.string(),
  query: (db, input) => db.update(users).set({
    plan: null,
    stripeCustomerId: null,
    subscriptionId: null,
    subscriptionStatus: SubscriptionStatus.not_subscribed,
    checkoutId: null,
  }).where(eq(users.id, input)).returning(),
})
