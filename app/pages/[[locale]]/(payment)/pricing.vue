<script setup lang="ts">
import { t } from '@psitta/vue'
import queryKeys from '~/queryKeys'
import { SubscriptionStatus } from '~~/db/schema'

definePageMeta({
  title: 'Pricing',
  layout: 'site',
  layoutTransition: false,
})

const headers = useRequestHeaders(['cookie'])
const pricingQuery = useServerQuery({
  queryFn: () => $fetch('/api/payment/stripe/pricing-data', {
    headers,
  }),
  queryKey: queryKeys.pricingData,
  staleTime: 0,
})
</script>

<template>
  <div class="w-full relative" style="height: calc(100vh - 64px)">
    <div class="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 w-full text-center p-4">
      <h1 class="text-3xl text-black text-center mb-4">
        {{ t('Pricing') }}
      </h1>

      <div class="flex items-center justify-center flex-col gap-6">
        <Price />

        <StripeCreateSessionForm
          :checkout-status="pricingQuery.data.value?.checkoutStatus || null"
          :subscription-status="pricingQuery.data.value?.subscriptionStatus || SubscriptionStatus.not_subscribed"
        />
      </div>
    </div>
  </div>
</template>
