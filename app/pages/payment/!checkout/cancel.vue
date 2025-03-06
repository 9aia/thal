<script setup lang="ts">
import { t } from '@psitta/vue'

definePageMeta({
  title: 'Checkout canceled',
  middleware: 'canceled',
})

useAutoRedirect()
</script>

<template>
  <div class="w-full relative" style="height: calc(100vh - 64px)">
    <div class="text-center w-full max-w-2xl absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2">
      <h1 class="text-3xl text-black text-center mb-4">
        {{ t('Checkout Canceled') }}
      </h1>

      <p class="max-w-lg mx-auto text-base text-black mt-4 w-full flex items-center justify-center">
        {{ t('You canceled your subscription. We hope to see you soon!') }}
      </p>

      <div class="flex items-center justify-center h-fit mt-4 gap-2">
        <A class="h-fit btn py-4 rounded-full bg-cyan-500 border-none flex gap-1" :href="t('https://forms.gle/yHaiExzsQvv1mTdM8')">
          {{ t('Give feedback') }}
        </A>

        <A href="/pricing" class="h-fit btn py-4 rounded-full bg-cyan-500 border-none flex gap-1">
          {{ t('Go to pricing') }}
        </A>
      </div>

      <p class="max-w-lg mx-auto text-xs text-gray-600 mt-4 w-full flex items-center justify-center">
        {{ t('We’d love to know why you decided not to cancel. Please share your feedback with us. Your input helps us improve!') }}
      </p>
    </div>
  </div>
</template>
