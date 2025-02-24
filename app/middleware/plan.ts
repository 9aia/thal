export default defineNuxtRouteMiddleware((event) => {
  const user = useUser()

  if (!user.value)
    return sendBackRedirect(event, '/sign-in')

  if (user.value.plan == null)
    return navigateTo('/pricing')
})
