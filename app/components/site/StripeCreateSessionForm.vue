<script setup lang="ts">
import { t } from '@psitta/vue'
import type { CheckoutStatus } from '~/types'
import { SubscriptionStatus } from '~~/db/schema'

const props = defineProps<{
  checkoutStatus: CheckoutStatus
  subscriptionStatus: SubscriptionStatus
  noInfo?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit'): void
}>()
const user = useUser()

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
      class="btn btn-primary btn-lg w-fit mx-auto"
    >
      {{ t('Start chatting') }}
    </Button>

    <p v-if="!noInfo" class="text-sm text-black flex items-center gap-2">
      <template v-if="!user || (checkoutStatus === null && subscriptionStatus === SubscriptionStatus.not_subscribed)">
        <Icon name="material-symbols:info-outline-rounded" class="text-warning" />
        {{ t('Try 1 Day Free – No Credit Card Needed') }}
      </template>
      <template v-else-if="checkoutStatus === 'open'">
        <Icon name="material-symbols:info-outline-rounded" class="text-black" />
        {{ t('Continue your checkout.') }}
      </template>
      <template v-else-if="checkoutStatus === 'complete' && subscriptionStatus === SubscriptionStatus.not_subscribed">
        <Icon name="material-symbols:info-outline-rounded" class="text-black" />
        {{ t('Continue your access.') }}
      </template>
      <template v-else-if="subscriptionStatus === SubscriptionStatus.trialing">
        <Icon name="material-symbols:info-outline-rounded" class="text-black" />
        {{ t('Continue your free trial.') }}
      </template>
      <template v-else-if="subscriptionStatus === SubscriptionStatus.active">
        <Icon name="material-symbols:info-outline-rounded" class="text-black" />
        {{ t('Continue chatting.') }}
      </template>
      <template v-else-if="subscriptionStatus === SubscriptionStatus.canceled">
        <Icon name="material-symbols:info-outline-rounded" class="text-black" />
        {{ t('Renew your subscription now.') }}
      </template>
      <template v-else-if="subscriptionStatus === SubscriptionStatus.incomplete">
        <Icon name="material-symbols:info-outline-rounded" class="text-black" />
        {{ t('Check your subscription now.') }}
      </template>
      <template v-else-if="subscriptionStatus === SubscriptionStatus.incomplete_expired">
        <Icon name="material-symbols:info-outline-rounded" class="text-black" />
        {{ t('Check your subscription now.') }}
      </template>
      <template v-else-if="subscriptionStatus === SubscriptionStatus.past_due">
        <Icon name="material-symbols:info-outline-rounded" class="text-black" />
        {{ t('Go to app.') }}
      </template>
      <template v-else-if="subscriptionStatus === SubscriptionStatus.paused">
        <Icon name="material-symbols:info-outline-rounded" class="text-black" />
        {{ t('Resume your subscription now.') }}
      </template>
      <template v-else-if="subscriptionStatus === SubscriptionStatus.unpaid">
        <Icon name="material-symbols:info-outline-rounded" class="text-black" />
        {{ t('Check your subscription now.') }}
      </template>
    </p>
  </form>
</template>
