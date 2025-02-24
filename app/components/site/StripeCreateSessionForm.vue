<script setup lang="ts">
import { t } from '@psitta/vue'
import type { CheckoutStatus } from '~/types'
import { SubscriptionStatus } from '~~/db/schema'

defineProps<{
  checkoutStatus: CheckoutStatus
}>()

const user = useUser()

function onSubmit(event: Event) {
  if (!user.value) {
    return
  }

  if (user.value.subscriptionStatus === SubscriptionStatus.trialing
    || user.value.subscriptionStatus === SubscriptionStatus.active
    || user.value.subscriptionStatus === SubscriptionStatus.past_due) {
    navigateTo('/app')
    event.preventDefault()
  }
}
</script>

<template>
  <form
    action="/api/payment/stripe/create-checkout-session"
    method="post"
    @submit="onSubmit"
  >
    <button
      id="checkout-and-portal-button" type="submit"
      class="h-fit btn py-4 rounded-full bg-cyan-500 border-none flex gap-1"
    >
      <template v-if="!user || checkoutStatus === null">
        {{ t('Start Your Free Trial Now') }}
      </template>
      <template v-else-if="checkoutStatus === 'open'">
        {{ t('Continue Your Checkout') }}
      </template>
      <template v-else-if="checkoutStatus === 'complete' && user.subscriptionStatus === SubscriptionStatus.not_subscribed">
        {{ t('Continue Your Access') }}
      </template>
      <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.trialing">
        {{ t('Continue Your Free Trial Now') }}
      </template>
      <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.active">
        {{ t('Continue Chatting') }}
      </template>
      <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.canceled">
        {{ t('Restart Your Subscription Now') }}
      </template>
      <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.incomplete">
        {{ t('Check Your Subscription Now') }}
      </template>
      <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.incomplete_expired">
        {{ t('Check Your Subscription Now') }}
      </template>
      <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.past_due">
        {{ t('Go To App') }}
      </template>
      <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.paused">
        {{ t('Resume Your Subscription Now') }}
      </template>
      <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.unpaid">
        {{ t('Check Your Subscription Now') }}
      </template>
    </button>
  </form>
</template>
