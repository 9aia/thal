<script setup lang="ts">
import { t } from '@psitta/vue'
</script>

<template>
  <div class="w-full">
    <p class="text-black text-sm text-center mb-8 max-w-lg mx-auto">
      <span class="text-gradient-7">Simple, Transparent Pricing.</span>
      {{ t('We believe in making language learning accessible and straightforward. That’s why we offer a single plan with everything you need to improve your English.') }}
    </p>

    <div class="max-w-sm mx-auto">
      <div class="p-4">
        <h2 class="text-4xl text-black flex gap-2 justify-center items-center">
          <Icon name="book_4_spark" class="text-black text-4xl" />
          {{ t('All-in-One Plan') }}
        </h2>

        <div class="flex items-center justify-center py-2 mb-4">
          <span class="text-4xl text-gradient-7">R$29.99</span>
          <span class="text-gray-800 ml-1">/{{ t('month') }}</span>
        </div>

        <p class="text-gray-500 text-sm mb-2 text-center">
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
              {{ t('Translations, corrections, and listening on the go.') }}
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

        <p class="text-gray-500 text-xs mb-4 text-center">
          {{ t('No hidden fees. Access every feature without additional charges. Cancel anytime.') }}
        </p>

        <p class="text-black text-sm mb-4 text-center">
          {{ t('Curious to see how chatting can boost your English?') }}
        </p>

        <div class="flex items-center justify-center h-fit mt-4 gap-2">
          <form action="/api/payment/stripe/create-checkout-session" method="post">
            <button
              id="checkout-and-portal-button" type="submit"
              class="h-fit btn py-4 rounded-full bg-cyan-500 border-none flex gap-1"
            >
              {{ t('Subscribe now') }}
            </button>
          </form>
        </div>
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
