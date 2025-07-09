import type { H3Event } from 'h3'
import type Stripe from 'stripe'
import { createSubscription, deletedSubscription, updateSubscription } from '../services/plan'

// TODO: refactor this. Move to the webhook directly

export async function handleSubscriptionCreated(
  event: H3Event,
  subscriptionCreated: Stripe.CustomerSubscriptionCreatedEvent,
) {
  const orm = event.context.orm
  const subscription = subscriptionCreated.data.object

  await createSubscription(orm, subscription)
}

export async function handleSubscriptionUpdated(
  event: H3Event,
  subscriptionUpdated: Stripe.CustomerSubscriptionUpdatedEvent,
) {
  const orm = event.context.orm
  const subscription = subscriptionUpdated.data.object

  await updateSubscription(orm, subscription)
}

export async function handleSubscriptionTrialWillEnd(
  event: H3Event,
  subscriptionTrialWillEnd: Stripe.CustomerSubscriptionTrialWillEndEvent,
) {
  const orm = event.context.orm
  const subscription = subscriptionTrialWillEnd.data.object

  await updateSubscription(orm, subscription)
}

export async function handleSubscriptionDeleted(
  event: H3Event,
  subscriptionDeleted: Stripe.CustomerSubscriptionDeletedEvent,
) {
  const orm = event.context.orm
  const subscription = subscriptionDeleted.data.object

  await deletedSubscription(orm, subscription)
}
