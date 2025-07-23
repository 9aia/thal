<script setup lang="ts">
import { t } from '@psitta/vue'

definePageMeta({
  layout: 'site',
  title: 'Checkout canceled',
  middleware: 'plan-non-active',
  layoutTransition: false,
})
</script>

<template>
  <div class="site-container w-full relative" style="height: calc(100vh - 64px)">
    <div class="text-center w-full max-w-2xl absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2">
      <h1 class="text-3xl text-black text-center mb-4">
        {{ t('Checkout Canceled') }}
      </h1>

      <p class="max-w-lg mx-auto text-base text-black mt-4 w-full flex items-center justify-center">
        {{ t('You canceled your subscription. We hope to see you soon!') }}
      </p>

      <div class="flex items-center justify-center h-fit mt-4 gap-2">
        <A
          class="btn btn-primary"
          :localize="false"
          href="https://forms.gle/UyGBzPrBeNfFgwLD6"
        >
          {{ t('Submit a problem or suggestion') }}
        </A>

        <A href="/pricing" class="btn btn-soft btn-primary">
          {{ t('Go to pricing') }}
        </A>
      </div>

      <p class="max-w-lg mx-auto text-xs text-gray-600 mt-4 w-full flex items-center justify-center">
        {{ t('We’d love to know why you decided to cancel. Please share your feedback with us. Your input helps us improve!') }}
      </p>
    </div>
  </div>
</template>
