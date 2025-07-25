<script setup lang="ts">
import { tv } from 'tailwind-variants'
import { SubscriptionStatus } from '~~/db/schema'

const props = defineProps<{
  class?: string
  buttonClass?: string
  keepCta?: boolean
}>()

const user = useUser()
const { t } = useI18nExperimental()
const toast = useToast()

const subscriptionQuery = useSubscriptionQuery()
await subscriptionQuery.suspense()

onMounted(() => {
  watch(subscriptionQuery.error, (error) => {
    if (error) {
      toast.error(t('Something went wrong getting your subscription status.'), 0)
    }
  }, { immediate: true })
})

const form = tv({
  base: 'flex gap-2',
})

const button = tv({
  base: 'btn',
  variants: {
    status: {
      [SubscriptionStatus.not_subscribed]: 'btn-primary',
      [SubscriptionStatus.incomplete]: 'btn-warning',
      [SubscriptionStatus.incomplete_expired]: 'btn-error',
      [SubscriptionStatus.paused]: 'btn-warning',
      [SubscriptionStatus.canceled]: 'btn-warning',
      [SubscriptionStatus.unpaid]: 'btn-error',
      [SubscriptionStatus.past_due]: 'btn-warning',
    },
  },
})

const action = computed(() => {
  if (user.value?.subscriptionStatus === null || user.value?.subscriptionStatus === SubscriptionStatus.not_subscribed) {
    return '/api/payment/stripe/create-checkout-session'
  }

  if (user.value?.subscriptionStatus === SubscriptionStatus.incomplete) {
    return '/api/payment/stripe/create-checkout-session'
  }

  if (user.value?.subscriptionStatus === SubscriptionStatus.incomplete_expired) {
    return '/api/payment/stripe/create-checkout-session'
  }

  if (user.value?.subscriptionStatus === SubscriptionStatus.paused) {
    return '/api/payment/stripe/create-portal-session'
  }

  if (user.value?.subscriptionStatus === SubscriptionStatus.canceled) {
    return '/api/payment/stripe/create-checkout-session'
  }

  if (user.value?.subscriptionStatus === SubscriptionStatus.unpaid) {
    return '/api/payment/stripe/create-portal-session'
  }

  if (user.value?.subscriptionStatus === SubscriptionStatus.past_due) {
    return '/api/payment/stripe/create-portal-session'
  }

  return '/api/payment/stripe/create-portal-session'
})
</script>

<template>
  <form
    v-if="subscriptionQuery.isSuccess.value"
    :action="action"
    method="post"
    :class="form({ class: props.class })"
  >
    <Button
      v-if="!subscriptionQuery.data.value?.processingTrialActivation || props.keepCta"
      type="submit"
      :class="button({ status: user?.subscriptionStatus ?? SubscriptionStatus.not_subscribed, class: props.buttonClass })"
      icon="material-symbols:north-west-rounded"
      icon-class="text-base rotate-90"
      icon-position="right"
    >
      <template v-if="user?.subscriptionStatus === null || user?.subscriptionStatus === SubscriptionStatus.not_subscribed">
        {{ t("Start Trial") }}
      </template>

      <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.incomplete">
        {{ t("Complete Payment") }}
      </template>

      <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.incomplete_expired">
        {{ t("Try Again") }}
      </template>

      <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.paused">
        {{ t("Resume Now") }}
      </template>

      <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.canceled">
        <template v-if="subscriptionQuery.data.value?.cameFromCheckoutInTrialMode">
          {{ t("Set Payment") }}
        </template>
        <template v-else>
          {{ t("Subscribe Again") }}
        </template>
      </template>

      <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.unpaid">
        {{ t("Pay Now") }}
      </template>

      <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.past_due">
        {{ t("Fix Payment") }}
      </template>
    </Button>
  </form>
</template>
