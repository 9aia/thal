<script setup lang="ts">
import { t, useLocale } from '@psitta/vue'
import { PLANS } from '~/constants/payment'
import queryKeys from '~/queryKeys'
import { SubscriptionStatus } from '~~/db/schema'

const locale = useLocale()

const {
  data,
  isLoading,
  isError,
  refetch,
} = await useServerQuery(`/api/payment/stripe/pricing-data`, {
  queryKey: queryKeys.pricingData,
  staleTime: 0,
})

const price = computed(() => {
  return new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(data.value.price))
})

const discountPrice = computed(() => new Intl.NumberFormat(locale.value, {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})
  .format(0),
)

const trialPeriodDays = PLANS.allInOne.trialPeriodDays
</script>

<template>
  <div class="w-full">
    <p class="text-black text-sm text-center mb-8 max-w-lg mx-auto">
      <span class="text-gradient-7">{{ t('Simple, Transparent Pricing.') }}</span>
      {{ t('We believe in making language learning accessible and straightforward. That’s why we offer a single plan with everything you need to improve your English.') }}
    </p>

    <div class="max-w-sm mx-auto">
      <div class="p-4">
        <h2 class="text-4xl text-black flex gap-2 justify-center items-center">
          <Icon name="book_4_spark" class="text-black text-4xl" />
          {{ t('All-in-One Plan') }}
        </h2>

        <p class="text-gray-500 text-sm mb-2 mt-4 text-center">
          {{ t('What’s included:') }}
        </p>

        <ul class="flex flex-col mx-auto text-gray-500 space-y-1 mb-4 text-sm">
          <li class="flex justify-center gap-2">
            <Icon name="check" class="text-blue-500" />
            <div class="gap-2">
              <span class="text-blue-500">{{ t('Engaging Conversations:') }}</span>
              {{ t('Chat with AI-powered characters anytime, anywhere.') }}
            </div>
          </li>

          <li class="flex justify-center gap-2">
            <Icon name="check" class="text-blue-500" />
            <div class="gap-2">
              <span class="text-blue-500">{{ t('Interactive Assistance:') }}</span>
              {{ t('Translations, corrections, and listening while chatting.') }}
            </div>
          </li>

          <li class="flex justify-center gap-2">
            <Icon name="check" class="text-blue-500" />
            <div class="gap-2">
              <span class="text-blue-500">{{ t('Personalized Characters:') }}</span>
              {{ t('Create, discover and save characters for tailored learning.') }}
            </div>
          </li>
        </ul>

        <Resource :loading="isLoading" :error="isError || data?.price == null">
          <template #loading>
            <div class="w-full h-full flex items-center justify-center mb-4">
              <Spinner class="text-gray-800" />
            </div>
          </template>

          <template #error>
            <ErrorFallback :loading="isLoading" centered class="mb-4" @retry="refetch" />
          </template>

          <template #default>
            <div class="flex flex-col items-center justify-center py-2 gap-1 text-2xl">
              <div class="flex justify-center items-center gap-1">
                <div class="flex items-center gap-1">
                  <div class="line-through">
                    {{ price }}
                  </div>

                  <span class="text-gradient-7">
                    {{ discountPrice }}
                  </span>
                </div>
              </div>

              <span class="text-gray-800 ml-1">
                <div>{{ t('for the first {x} (day|days)', { x: trialPeriodDays }) }}</div>
              </span>

              <div class="text-gray-500 text-base text-center">
                {{ t('{price}/month after', { price }) }}
              </div>
            </div>

            <div class="text-gray-500 text-xs text-center">
              {{ t('No hidden fees. Cancel anytime.') }}
              <A class="underline text-brown-500" href="/terms">{{ t('Terms apply') }}</A>
            </div>

            <p class="text-black text-sm mb-4 text-center mt-6">
              {{ t('Curious to see how chatting can boost your English?') }}
            </p>

            <div class="flex flex-col items-center justify-center h-fit mt-4 gap-2">
              <StripeCreateSessionForm :checkout-status="data?.checkoutStatus || null" :subscription-status="data?.subscriptionStatus || SubscriptionStatus.not_subscribed" />

              <div class="text-blue-500 text-xs flex mt-2 justify-center text-center">
                <div>{{ t("Thal is in preview. We're not actually charging for access.") }}</div>
              </div>
            </div>
          </template>
        </Resource>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-gradient-7 {
  background: linear-gradient(12deg, theme('colors.magenta.500'), theme('colors.red.500')) !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
  color: transparent !important;
}
</style>
