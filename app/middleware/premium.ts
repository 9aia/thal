import { SubscriptionStatus } from '~~/db/schema'

export default defineNuxtRouteMiddleware((event) => {
  const user = useUser()

  if (!user.value)
    return sendBackRedirect(event, '/sign-in')

  if (user.value.subscriptionStatus === SubscriptionStatus.canceled) {
    return sendBackRedirect(event, '/pricing')
  }

  const hasPlan = user.value.plan != null

  if (hasPlan) {
    if (user.value.subscriptionStatus === SubscriptionStatus.past_due && !event.query.past_due) {
      return navigateTo({
        path: event.path,
        query: { ...event.query, past_due: 'true' },
      })
    }
  }
})
