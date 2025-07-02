import { SubscriptionStatus } from '~~/db/schema'

export default defineNuxtRouteMiddleware((event) => {
  const user = useUser()

  if (!user.value)
    return saveRouteAndNavigateTo(event, '/sign-in')

  if (user.value.subscriptionStatus !== SubscriptionStatus.canceled)
    return saveRouteAndNavigateTo(event, '/pricing')
})
