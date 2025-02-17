export default defineNuxtRouteMiddleware((event) => {
  const user = useUser()

  if (!user.value)
    return sendBackRedirect(event, '/sign-in')

  if (!user.value.plan) {
    const hasTrialBeenUsed = useHasTrialBeenUsed()

    return hasTrialBeenUsed.value
      ? sendBackRedirect(event, '/plan/pending')
      : sendBackRedirect(event, '/pricing')
  }

  if (user.value.plan && hasPlanExpired(user.value) && !event.query.expired) {
    return navigateTo({
      path: event.path,
      query: { ...event.query, expired: 'true' },
    })
  }
})
