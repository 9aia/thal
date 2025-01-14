<script setup lang="ts">
import { T, t } from '@psitta/vue'
import Link from '~/components/ui/navigation/Link.vue'

definePageMeta({
  title: 'Checkout canceled',
})
</script>

<template>
  <div class="w-full relative" style="height: calc(100vh - 64px)">
    <div class="text-center w-full max-w-2xl absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2">
      <h1 class="text-3xl text-black text-center mb-4">
        {{ t('Checkout canceled') }}
      </h1>

      <p class="max-w-lg mx-auto text-base text-black mt-4 w-full flex items-center justify-center">
        <T
          text="We’d love to know why you decided not to subscribe. Please share your feedback with us {link}. Your input helps us improve!" :values="{
            link: t('https://forms.gle/ANMv7qnwTHva1k7L8'),
          }"
        >
          <template #link="{ link }">
            <A class="!text-brown-500 w-fit" :href="link">
              {{ t('here') }}
            </A>
          </template>
        </T>
      </p>

      <div class="flex items-center justify-center h-fit mt-4 gap-2">
        <A href="/" class="h-fit btn py-4 rounded-full bg-cyan-500 border-none flex gap-1">
          {{ t('Go to home') }}
        </A>

        <A href="/pricing" class="h-fit btn py-4 rounded-full bg-cyan-500 border-none flex gap-1">
          {{ t('Go to pricing') }}
        </A>
      </div>

      <p class="text-sm text-gray-600 mt-4 w-full flex items-center justify-center">
        <T
          class="flex flex-col items-center justify-center"
          text="If you have any problem, you can contact us at: {link}" :values="{
            link: 'thal@9aia.com',
          }"
        >
          <template #link="{ link }">
            <Link class="!text-brown-500 w-fit" :href="`mailto:${link}`">
              {{ link }}
            </Link>
          </template>
        </T>
      </p>
    </div>
  </div>
</template>
