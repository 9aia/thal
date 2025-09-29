import { SubscriptionStatus, type User } from '~~/server/db/schema'

export function canUseAIFeatures(user?: User | null) {
  if (!user) {
    return false
  }

  return user.subscriptionStatus === SubscriptionStatus.active
    || user.subscriptionStatus === SubscriptionStatus.trialing
    || user.subscriptionStatus === SubscriptionStatus.past_due
}
