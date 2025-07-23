<script setup lang="ts">
import { t } from '@psitta/vue'
import { tv } from 'tailwind-variants'
import { SubscriptionStatus } from '~~/db/schema'

const user = useUser()

const appNote = tv({
  slots: {
    h2: 'text-xs',
    button: 'btn btn-xs w-max',
  },
  variants: {
    status: {
      [SubscriptionStatus.not_subscribed]: {
        h2: 'text-primary',
        button: 'btn-primary',
      },
      [SubscriptionStatus.incomplete]: {
        h2: 'text-warning',
        button: 'btn-warning',
      },
      [SubscriptionStatus.incomplete_expired]: {
        h2: 'text-error',
        button: 'btn-error',
      },
      [SubscriptionStatus.paused]: {
        h2: 'text-warning',
        button: 'btn-warning',
      },
      [SubscriptionStatus.canceled]: {
        h2: 'text-warning',
        button: 'btn-warning',
      },
      [SubscriptionStatus.unpaid]: {
        h2: 'text-error',
        button: 'btn-error',
      },
      [SubscriptionStatus.past_due]: {
        h2: 'text-warning',
        button: 'btn-warning',
      },
    },
  },
})
const styles = appNote()
</script>

<template>
  <AppNote
    hide-close
  >
    <div class="px-4 flex justify-between items-center gap-3 w-full">
      <h2 :class="styles.h2({ status: user?.subscriptionStatus ?? SubscriptionStatus.not_subscribed })">
        <template v-if="user?.subscriptionStatus === null || user?.subscriptionStatus === SubscriptionStatus.not_subscribed">
          {{ t("Unlock chatting with thals and all core features.") }}
        </template>
        <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.incomplete">
          {{ t("Complete payment to unlock chatting with thals and all core features.") }}
        </template>
        <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.incomplete_expired">
          {{ t("Your last subscription attempt expired.") }}
        </template>
        <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.paused">
          {{ t("Resume your subscription to continue chatting with thals and all core features.") }}
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

      <form action="/api/payment/stripe/create-portal-session" method="POST">
        <Button
          :class="styles.button({ status: user?.subscriptionStatus ?? SubscriptionStatus.not_subscribed })"
          icon="material-symbols:north-west-rounded"
          icon-class="text-base rotate-90"
          icon-position="right"
        >
          <template v-if="user?.subscriptionStatus === null || user?.subscriptionStatus === SubscriptionStatus.not_subscribed">
            {{ t("Start Trial") }}
          </template>
          <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.incomplete">
            {{ t("Complete") }}
          </template>
          <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.incomplete_expired">
            {{ t("Try Again") }}
          </template>
          <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.paused">
            {{ t("Resume") }}
          </template>
          <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.canceled">
            {{ t("Resubscribe") }}
          </template>
          <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.unpaid">
            {{ t("Pay Now") }}
          </template>
          <template v-else-if="user?.subscriptionStatus === SubscriptionStatus.past_due">
            {{ t("Update Payment") }}
          </template>
        </Button>
      </form>
    </div>
  </AppNote>
</template>
