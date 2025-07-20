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
    >
      <template v-if="(!user || (checkoutStatus === null && subscriptionStatus === SubscriptionStatus.not_subscribed))">
        {{ t('Start chatting') }}
      </template>

      <template v-else-if="checkoutStatus === 'open'">
        {{ t('Continue your checkout') }}
      </template>

      <template v-else-if="checkoutStatus === 'complete' && subscriptionStatus === SubscriptionStatus.not_subscribed">
        {{ t('Continue your access') }}
      </template>

      <template v-else-if="subscriptionStatus === SubscriptionStatus.trialing">
        {{ t('Continue your free trial') }}
      </template>

      <template v-else-if="subscriptionStatus === SubscriptionStatus.active">
        {{ t('Continue chatting') }}
      </template>

      <template v-else-if="subscriptionStatus === SubscriptionStatus.canceled">
        {{ t('Renew your subscription now') }}
      </template>

      <template v-else-if="subscriptionStatus === SubscriptionStatus.incomplete">
        {{ t('Check your subscription now') }}
      </template>

      <template v-else-if="subscriptionStatus === SubscriptionStatus.incomplete_expired">
        {{ t('Check your subscription now') }}
      </template>

      <template v-else-if="subscriptionStatus === SubscriptionStatus.past_due">
        {{ t('Access app') }}
      </template>

      <template v-else-if="subscriptionStatus === SubscriptionStatus.paused">
        {{ t('Resume your subscription now') }}
      </template>

      <template v-else-if="subscriptionStatus === SubscriptionStatus.unpaid">
        {{ t('Check your subscription now') }}
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
