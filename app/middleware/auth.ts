export default defineNuxtRouteMiddleware((event) => {
  const user = useUser()

  if (!user.value) {
    console.log('User not authenticated, redirecting to sign-in')
    return saveRouteAndNavigateTo(event, '/sign-in')
  }
})
