export default defineNuxtRouteMiddleware((event) => {
  const user = useUser()

  if (!user.value)
    return sendBackRedirect(event, '/sign-in')

  if (!isPlanActive(user.value)) {
    return sendBackRedirect(event, '/pricing')
  }
})
