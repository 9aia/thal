import { isSubscriptionStatusModalOpen } from '~/store'
import { SubscriptionStatus } from '~~/server/db/schema'

function useSubscriptionStatusModal() {
  const user = useUser()
  const subscriptionStatusModalOpen = useCookie('thal_subscription_status_modal_opened', {
    default: () => [] as SubscriptionStatus[],
  })

  onMounted(() => {
    const subscriptionStatus = user.value?.subscriptionStatus ?? SubscriptionStatus.not_subscribed
    const open = subscriptionStatusModalOpen.value

    if (!canUseAIFeatures(user.value) && !open.includes(subscriptionStatus)) {
      isSubscriptionStatusModalOpen.value = true
    }
  })

  watch(isSubscriptionStatusModalOpen, (value) => {
    if (!value) {
      const subscriptionStatus = user.value!.subscriptionStatus ?? SubscriptionStatus.not_subscribed

      if (subscriptionStatusModalOpen.value.includes(subscriptionStatus)) {
        return
      }

      subscriptionStatusModalOpen.value.push(subscriptionStatus)
    }
  })
}

export default useSubscriptionStatusModal
