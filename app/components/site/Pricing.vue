<script setup lang="ts">
import { t, useLocale } from '@psitta/vue'
import { PLANS } from '~/constants/payment'
import queryKeys from '~/queryKeys'

const locale = useLocale()

const headers = useRequestHeaders(['cookie'])
const pricingQuery = useServerQuery({
  queryFn: () => $fetch('/api/payment/stripe/pricing-data', {
    headers,
  }),
  queryKey: queryKeys.pricingData,
  staleTime: 0,
})

const price = computed(() => {
  return new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(pricingQuery.data.value?.price))
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
    <div class="max-w-sm mx-auto border-2 border-linear-[12deg] from-blue-500 to-magenta-500 rounded-3xl">
      <div class="p-12">
        <h2 class="text-4xl text-black flex gap-2 justify-center items-center">
          <Icon name="material-symbols:package-2-outline" class="text-black text-4xl" />
          {{ t('Subscription') }}
        </h2>

        <p class="text-gray-500 text-sm mb-2 mt-4 text-center">
          {{ t('What’s included:') }}
        </p>

        <ul class="flex flex-col mx-auto text-gray-500 space-y-1 mb-4 text-sm">
          <li class="flex justify-center gap-2">
            <Icon name="material-symbols:check" class="text-blue-500" />
            <div class="gap-2">
              <span class="text-blue-500">{{ t('Engaging Conversations:') }}</span>
              {{ t('Chat with AI-powered characters anytime, anywhere.') }}
            </div>
          </li>

          <li class="flex justify-center gap-2">
            <Icon name="material-symbols:check" class="text-blue-500" />
            <div class="gap-2">
              <span class="text-blue-500">{{ t('Interactive Assistance:') }}</span>
              {{ t('Translations, corrections, and listening while chatting.') }}
            </div>
          </li>

          <li class="flex justify-center gap-2">
            <Icon name="material-symbols:check" class="text-blue-500" />
            <div class="gap-2">
              <span class="text-blue-500">{{ t('Personalized Characters:') }}</span>
              {{ t('Create, discover and save characters for tailored learning.') }}
            </div>
          </li>
        </ul>

        <CommonResource
          :for="{
            data: pricingQuery.data,
            isLoading: pricingQuery.isLoading,
            isError: pricingQuery.isError.value || pricingQuery.data.value?.price == null,
            refetch: pricingQuery.refetch,
          }"
          centered-error-fallback
        >
          <div class="flex flex-col items-center justify-center py-2 gap-1 text-2xl">
            <div class="flex justify-center items-center gap-1">
              <div class="flex items-center gap-1">
                <div class="line-through">
                  {{ price }}
                </div>

                <span class="text-gradient bg-linear-[12deg] from-magenta-500 to-red-500">
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
        </CommonResource>
      </div>
    </div>
  </div>
</template>
