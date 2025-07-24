<script setup lang="ts">
import { tv } from 'tailwind-variants'
import { SubscriptionStatus } from '~~/db/schema'

const user = useUser()
const toast = useToast()
const { t } = useI18nExperimental()

const subscriptionStatusModalOpen = useCookie('thal_subscription_status_modal_opened', {
  default: () => [] as SubscriptionStatus[],
})

const subscriptionQuery = useSubscriptionQuery()
await subscriptionQuery.suspense()

const h2 = tv({
  base: 'text-xs',
  variants: {
    status: {
      [SubscriptionStatus.not_subscribed]: 'text-primary',
      [SubscriptionStatus.incomplete]: 'text-warning',
      [SubscriptionStatus.incomplete_expired]: 'text-error',
      [SubscriptionStatus.paused]: 'text-warning',
      [SubscriptionStatus.canceled]: 'text-warning',
      [SubscriptionStatus.unpaid]: 'text-error',
      [SubscriptionStatus.past_due]: 'text-warning',
    },
  },
})

onMounted(() => {
  watch(subscriptionQuery.error, (error) => {
    if (error) {
      toast.error(t('Something went wrong getting your subscription status.'), 0)
    }
  }, { immediate: true })
})
</script>

<template>
  <AppNote
    v-if="subscriptionQuery.isSuccess.value"
    hide-close
  >
    <div class="px-4 flex justify-between items-center gap-3 w-full">
      <h2 :class="h2({ status: user?.subscriptionStatus ?? SubscriptionStatus.not_subscribed })">
        <template v-if="user?.subscriptionStatus === null || user?.subscriptionStatus === SubscriptionStatus.not_subscribed">
          <template v-if="subscriptionQuery.data.value?.processingTrialActivation">
            <template v-if="subscriptionStatusModalOpen.includes(SubscriptionStatus.not_subscribed)">
              {{ t("Your trial is activating—hang tight, you'll be creating characters soon!") }}
            </template>
            <template v-else>
              {{ t("Checkout complete! Your trial is almost ready. Thanks for joining Thal!") }}
            </template>
          </template>
          <template v-else>
            {{ t("Start creating characters and boost your English now—join Thal today!") }}
          </template>
        </template>

        <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.incomplete">
          {{ t("Almost there! Please finish your payment to unlock all Thal features.") }}
        </template>

        <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.incomplete_expired">
          {{ t("Your payment window expired. No charge—restart anytime to begin learning!") }}
        </template>

        <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.paused">
          {{ t("Your subscription is paused. Resume now to keep improving your English!") }}
        </template>

        <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.canceled">
          <template v-if="subscriptionQuery.data.value?.cameFromCheckoutInTrialMode">
            {{ t("Your trial ended. Add a payment method to keep creating characters with Thal!") }}
          </template>
          <template v-else>
            {{ t("Subscription canceled. Subscribe again to continue your English journey!") }}
          </template>
        </template>

        <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.unpaid">
          {{ t("Payment needed! Settle your invoice to restore full access to Thal.") }}
        </template>

        <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.past_due">
          {{ t("Payment failed. Please update your info to keep your subscription active.") }}
        </template>
      </h2>

      <SubscriptionStatusForm button-class="btn-xs w-max" keep-cta />
    </div>
  </AppNote>
</template>
