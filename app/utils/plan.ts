import { SubscriptionStatus, type User } from '~~/db/schema'

export function isPlanActive(user: User) {
  if (user.subscriptionStatus === null) {
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

  if (user.subscriptionStatus === null) {
    return false
  }

  return user.subscriptionStatus === SubscriptionStatus.past_due
}
