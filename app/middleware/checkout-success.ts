import { SubscriptionStatus } from '~~/db/schema'

export default defineNuxtRouteMiddleware((event) => {
  const user = useUser()

  if (!user.value)
    return saveRouteAndNavigateTo(event, '/sign-in')

  // TODO: check this
  if (user.value.subscriptionStatus === SubscriptionStatus.canceled)
    return navigateTo('/pricing')

  if (isPlanActive(user.value))
    return navigateTo('/app')
})
