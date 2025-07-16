<script setup lang="ts">
import { T, t, useLocale } from '@psitta/vue'
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
  <CommonResource
    :for="{
      data: pricingQuery.data,
      isLoading: pricingQuery.isLoading,
      isError: pricingQuery.isError.value || pricingQuery.data.value?.price == null,
      refetch: pricingQuery.refetch,
    }"
    centered-error-fallback
    common-error-fallback-class="pb-4"
  >
    <div>
      <div class="flex flex-col items-center pt-2 gap-1 text-2xl">
        <div class="text-gray-800">
          <T
            text="{price} {discountPrice} for the first {x} (day|days)"
            :values="{ price, discountPrice, x: trialPeriodDays }"
            class="flex flex-wrap items-center justify-center gap-x-1"
          >
            <template #price>
              <div class="line-through">
                {{ price }}
              </div>
            </template>

            <template #discountPrice>
              <span class="text-gradient bg-linear-[12deg] from-magenta-500 to-blue-500">
                {{ discountPrice }}
              </span>
            </template>

            <template #x="{ decline }">
              {{ trialPeriodDays }} {{ decline(trialPeriodDays) }}
            </template>
          </T>
        </div>

        <div class="text-gray-500 text-base text-center">
          {{ t('{price}/month after', { price }) }}
        </div>
      </div>

      <div class="text-gray-500 text-xs text-center mt-2">
        {{ t('No hidden fees. Cancel or pause anytime.') }}
        <A class="underline text-brown-500 border-b-2 border-transparent focus:border-blue-500 focus:outline-none" href="/terms">{{ t('Terms apply') }}</A>
      </div>
    </div>
  </CommonResource>
</template>
