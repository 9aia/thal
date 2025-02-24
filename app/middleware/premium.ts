export default defineNuxtRouteMiddleware((event) => {
  const user = useUser()

  if (!user.value)
    return sendBackRedirect(event, '/sign-in')

  const hasPlan = user.value.plan != null

  if (!hasPlan) {
    const hasTrialBeenUsed = useHasTrialBeenUsed()

    return hasTrialBeenUsed.value
      ? sendBackRedirect(event, '/plan/pending')
      : sendBackRedirect(event, '/pricing')
  }

  if (hasPlan && isSubscriptionUnpaid(user.value) && !event.query.unpaid) {
    return navigateTo({
      path: event.path,
      query: { ...event.query, unpaid: 'true' },
    })
  }
})
