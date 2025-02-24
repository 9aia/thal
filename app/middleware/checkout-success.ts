import { SubscriptionStatus } from '~~/db/schema'

export default defineNuxtRouteMiddleware((event) => {
  const user = useUser()

  if (!user.value)
    return sendBackRedirect(event, '/sign-in')

  if (user.value.subscriptionStatus === SubscriptionStatus.unpaid)
    return sendBackRedirect(event, '/pricing')

  if (user.value.subscriptionStatus === SubscriptionStatus.active || user.value.subscriptionStatus === SubscriptionStatus.trialing || user.value.subscriptionStatus === SubscriptionStatus.past_due)
    return sendBackRedirect(event, '/app')
})
