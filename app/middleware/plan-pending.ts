export default defineNuxtRouteMiddleware((event) => {
  const user = useUser()

  if (!user.value)
    return saveRouteAndNavigateTo(event, '/sign-in')

  if (user.value.plan == null)
    return navigateTo('/pricing')

  if (isPlanActive(user.value))
    return navigateTo('/app')
})
