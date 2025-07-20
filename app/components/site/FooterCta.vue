<script setup lang="ts">
import { t } from '@psitta/vue'
import { SubscriptionStatus } from '~~/db/schema'

const RUNTIME_ENV = useRuntimeConfig().public.RUNTIME_ENV

const pricingQuery = usePricingQuery()
await pricingQuery.suspense()
</script>

<template>
  <h2 class="text-black text-2xl mb-4 text-center">
    {{ t('Curious to see how chatting can boost your English?') }}
  </h2>

  <p class="text-black text-base mb-4 text-center">
    {{ t('No heart system. No BS. Just you, talking like a pro.') }}
  </p>

  <div class="flex flex-col items-center justify-center h-fit mt-4 gap-2">
    <StripeCreateSessionForm
      :checkout-status="pricingQuery.data.value?.checkoutStatus || null"
      :subscription-status="pricingQuery.data.value?.subscriptionStatus || SubscriptionStatus.not_subscribed"
    />

    <div v-if="RUNTIME_ENV === 'dev' || RUNTIME_ENV === 'preview'" class="text-blue-500 text-xs flex mt-2 justify-center text-center">
      <div>{{ t("Thal is in preview. We're not actually charging for access.") }}</div>
    </div>
  </div>
</template>
