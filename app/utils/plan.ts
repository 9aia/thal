import { SubscriptionStatus, type User } from '~~/db/schema'

export function isSubscriptionUnpaid(user: User) {
  if (user.plan == null)
    throw internal('User does not have a plan')

  // not_subscribed = 0,
  // incomplete = 3,
  // incomplete_expired = 4,
  // paused = 5,
  // canceled = 6,
  // unpaid = 7,
  // past_due = 8,

  return user.subscriptionStatus === SubscriptionStatus.unpaid
}
