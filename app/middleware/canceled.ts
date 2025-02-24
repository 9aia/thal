import { SubscriptionStatus } from '~~/db/schema'

export default defineNuxtRouteMiddleware((event) => {
  const user = useUser()

  if (!user.value)
    return sendBackRedirect(event, '/sign-in')

  if (user.value.subscriptionStatus !== SubscriptionStatus.canceled)
    return sendBackRedirect(event, '/pricing')
})
