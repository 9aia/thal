import { SubscriptionStatus } from '~~/db/schema'

export default defineNuxtRouteMiddleware((event) => {
  const user = useUser()

  if (!user.value)
    return sendBackRedirect(event, '/sign-in')

  if (user.value.subscriptionStatus === SubscriptionStatus.canceled)
    return navigateTo('/pricing')

  if (user.value.subscriptionStatus === SubscriptionStatus.active || user.value.subscriptionStatus === SubscriptionStatus.trialing || user.value.subscriptionStatus === SubscriptionStatus.past_due) {
    const urlToRedirect = useRedirectUrl()

    return sendBackRedirect(event, urlToRedirect.value || '/app')
  }
})
