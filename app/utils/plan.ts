import { SubscriptionStatus, type User } from '~~/db/schema'

export function isPlanActive(user?: User | null) {
  if (!user) {
    return false
  }

  return user.subscriptionStatus === SubscriptionStatus.active
    || user.subscriptionStatus === SubscriptionStatus.trialing
    || user.subscriptionStatus === SubscriptionStatus.past_due
}

export function isPlanPastDue(user?: User | null) {
  if (!user) {
    return false
  }

  return user.subscriptionStatus === SubscriptionStatus.past_due
}
