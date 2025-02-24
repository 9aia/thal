export default defineNuxtRouteMiddleware(() => {
  const user = useUser()

  if (!user.value)
    return navigateTo('/sign-in')

  if (user.value.plan != null)
    return navigateTo('/')
})
