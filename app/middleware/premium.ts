export default defineNuxtRouteMiddleware((event) => {
  const user = useUser()

  if (!user.value)
    return saveRouteAndNavigateTo(event, '/sign-in')

  if (!isPlanActive(user.value)) {
    return saveRouteAndNavigateTo(event, '/pricing')
  }
})
