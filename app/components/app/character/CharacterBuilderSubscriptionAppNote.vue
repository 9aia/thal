<script setup lang="ts">
import { t } from '@psitta/vue'
import { tv } from 'tailwind-variants'
import { SubscriptionStatus } from '~~/db/schema'

const user = useUser()

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
</script>

<template>
  <AppNote
    hide-close
  >
    <div class="px-4 flex justify-between items-center gap-3 w-full">
      <h2 :class="h2({ status: user?.subscriptionStatus ?? SubscriptionStatus.not_subscribed })">
        <template v-if="user?.subscriptionStatus === null || user?.subscriptionStatus === SubscriptionStatus.not_subscribed">
          {{ t("Unlock creating and editing characters, and all core features.") }}
        </template>
        <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.incomplete">
          {{ t("Complete payment to unlock character creation and editing, and all core features.") }}
        </template>
        <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.incomplete_expired">
          {{ t("Your last subscription attempt expired.") }}
        </template>
        <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.paused">
          {{ t("Resume your subscription to continue creating and editing characters, and all core features.") }}
        </template>
        <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.canceled">
          {{ t("Your subscription is canceled.") }}
        </template>
        <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.unpaid">
          {{ t("Your subscription has an unpaid balance. Access might be limited.") }}
        </template>
        <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.past_due">
          {{ t("Your last payment failed. Please update your payment details.") }}
        </template>
      </h2>

      <SubscriptionStatusForm button-class="btn-xs w-max" />
    </div>
  </AppNote>
</template>
