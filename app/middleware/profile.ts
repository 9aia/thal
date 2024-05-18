export default defineNuxtRouteMiddleware((event) => {
  const user = useUser()

  if (!user.value)
    return sendBackRedirect(event, "/sign-in")

  if (!user.value.plan)
    return sendBackRedirect(event, "/pricing")

  if (user.value.plan && hasPlanExpired(user.value))
    return sendBackRedirect(event, "/plan/expired")

  return navigateTo(`/profile/${user.value.username}`, { replace: true })
})
