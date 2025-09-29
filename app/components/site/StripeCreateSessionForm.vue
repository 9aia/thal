<script setup lang="ts">
import { tv } from 'tailwind-variants'
import type { CheckoutStatus } from '~~/shared/types'
import { SubscriptionStatus } from '~~/server/db/schema'

const props = defineProps<{
  checkoutStatus: CheckoutStatus
  subscriptionStatus: SubscriptionStatus
  buttonClass?: string
}>()

const emit = defineEmits<{
  (e: 'submit'): void
}>()
const user = useUser()
const redirectUrl = useRedirectUrl()
const toast = useToast()
const { t } = useI18nExperimental()

const subscriptionQuery = useSubscriptionQuery()
await subscriptionQuery.suspense()

onMounted(() => {
  watch(subscriptionQuery.error, (error) => {
    if (error) {
      toast.error(t('Something went wrong getting your subscription status.'), 0)
    }
  }, { immediate: true })
})

function onSubmit(event: Event) {
  emit('submit')

  if (!user.value) {
    return
  }

  if (props.subscriptionStatus === SubscriptionStatus.trialing
    || props.subscriptionStatus === SubscriptionStatus.active
    || props.subscriptionStatus === SubscriptionStatus.past_due) {
    event.preventDefault()
    navigateTo('/app')
  }
}

const buttonStyles = tv({
  base: 'btn btn-primary btn-lg w-fit mx-auto',
})
</script>

<template>
  <form
    v-if="subscriptionQuery.isSuccess.value"
    action="/api/payment/stripe/create-checkout-session"
    method="post"
    class="flex flex-col gap-2"
    @submit="onSubmit"
  >
    <Button
      id="checkout-and-portal-button"
      type="submit"
      :class="buttonStyles({ class: buttonClass })"
      @click="redirectUrl = '/app'"
    >
      <template v-if="!user">
        {{ t("Start Chatting") }}
      </template>

      <template v-else-if="user?.subscriptionStatus === null || user?.subscriptionStatus === SubscriptionStatus.not_subscribed">
        {{ t("Start Chatting") }}
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

      <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.trialing">
        {{ t("Continue Trial") }}
      </template>

      <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.active">
        {{ t("Start Chatting") }}
      </template>
    </Button>

    <p
      v-if="!user || (checkoutStatus === null && subscriptionStatus === SubscriptionStatus.not_subscribed)"
      class="text-sm text-black flex items-center gap-2"
    >
      <Icon name="material-symbols:info-outline-rounded" class="text-warning" />
      {{ t('Try 1 Day Free – No Credit Card Needed') }}
    </p>
  </form>
</template>
