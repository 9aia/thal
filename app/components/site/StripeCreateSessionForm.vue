<script setup lang="ts">
import { t } from '@psitta/vue'
import { tv } from 'tailwind-variants'
import type { CheckoutStatus } from '~/types'
import { SubscriptionStatus } from '~~/db/schema'

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

// TODO: fetch subscription is-trial mode
const isLastCheckoutTrial = computed(() => {
  return true
})

// TODO: fetch checkout status as well
const isCheckoutProcessing = computed(() => {
  return !!user.value?.checkoutId
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
      <template v-if="user?.subscriptionStatus === null || user?.subscriptionStatus === SubscriptionStatus.not_subscribed">
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
        <template v-if="isLastCheckoutTrial">
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

      <!-- TODO: add these back -->
      <!-- <template v-if="(!user || (checkoutStatus === null && subscriptionStatus === SubscriptionStatus.not_subscribed))">
        {{ t('Start chatting') }}
      </template>

      <template v-else-if="checkoutStatus === 'open'">
        {{ t('Continue your checkout') }}
      </template>

      <template v-else-if="checkoutStatus === 'complete' && subscriptionStatus === SubscriptionStatus.not_subscribed">
        {{ t('Continue your access') }}
      </template>
    -->
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
