import { SubscriptionStatus, type User } from '~~/db/schema'

export function isSubscriptionUnpaid(user: User) {
  if (user.plan == null)
    throw internal('User does not have a plan')

  return user.subscriptionStatus === SubscriptionStatus.unpaid
}
