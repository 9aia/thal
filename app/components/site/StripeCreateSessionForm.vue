<script setup lang="ts">
import { t } from '@psitta/vue'
import type { CheckoutStatus } from '~/types'
import { SubscriptionStatus } from '~~/db/schema'

const props = defineProps<{
  checkoutStatus: CheckoutStatus
  subscriptionStatus: SubscriptionStatus
}>()

const user = useUser()

function onSubmit(event: Event) {
  if (!user.value) {
    return
  }

  if (props.subscriptionStatus === SubscriptionStatus.trialing
    || props.subscriptionStatus === SubscriptionStatus.active
    || props.subscriptionStatus === SubscriptionStatus.past_due) {
    navigateTo('/app')
    event.preventDefault()
  }
}
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
      class="btn btn-primary btn-lg"
    >
      {{ t('Chat now!') }}
    </Button>

    <p class="text-sm text-gray-600">
      <template v-if="!user || (checkoutStatus === null && subscriptionStatus === SubscriptionStatus.not_subscribed)">
        {{ t('Start our free trial now.') }}
      </template>
      <template v-else-if="checkoutStatus === 'open'">
        {{ t('Continue your checkout.') }}
      </template>
      <template v-else-if="checkoutStatus === 'complete' && subscriptionStatus === SubscriptionStatus.not_subscribed">
        {{ t('Continue your access.') }}
      </template>
      <template v-else-if="subscriptionStatus === SubscriptionStatus.trialing">
        {{ t('Continue your free trial.') }}
      </template>
      <template v-else-if="subscriptionStatus === SubscriptionStatus.active">
        {{ t('Continue chatting.') }}
      </template>
      <template v-else-if="subscriptionStatus === SubscriptionStatus.canceled">
        {{ t('Renew your subscription now.') }}
      </template>
      <template v-else-if="subscriptionStatus === SubscriptionStatus.incomplete">
        {{ t('Check your subscription now.') }}
      </template>
      <template v-else-if="subscriptionStatus === SubscriptionStatus.incomplete_expired">
        {{ t('Check your subscription now.') }}
      </template>
      <template v-else-if="subscriptionStatus === SubscriptionStatus.past_due">
        {{ t('Go to app.') }}
      </template>
      <template v-else-if="subscriptionStatus === SubscriptionStatus.paused">
        {{ t('Resume your subscription now.') }}
      </template>
      <template v-else-if="subscriptionStatus === SubscriptionStatus.unpaid">
        {{ t('Check your subscription now.') }}
      </template>
    </p>
  </form>
</template>
