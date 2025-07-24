<script setup lang="ts">
import { SubscriptionStatus } from '~~/db/schema'

definePageMeta({
  title: 'Pricing',
  layout: 'site',
  layoutTransition: false,
})

const { t } = useI18nExperimental()
const pricingQuery = usePricingQuery()
await pricingQuery.suspense()

const featureList = computed(() => [
  { title: t('Engaging Conversations:'), description: t('Chat with AI-powered characters anytime, anywhere.') },
  { title: t('Interactive Assistance:'), description: t('Translations, corrections, and listening while chatting.') },
  { title: t('Personalized Characters:'), description: t('Create, discover and save characters for tailored learning.') },
])
</script>

<template>
  <div class="w-full min-h-[calc(100vh-64px)] bg-white flex items-center justify-center px-4">
    <div class="max-w-[800px] mx-auto text-center">
      <!-- Pricing Card -->
      <div class="max-w-lg mx-auto rounded-3xl">
        <div class="p-12">
          <!-- Card Header -->
          <div class="text-left mb-6">
            <h1 class="text-4xl text-center text-black mb-2">
              {{ t('Get Thal Pro') }}
            </h1>

            <Price />
          </div>

          <!-- Features List -->
          <ul class="flex flex-col gap-2 mx-auto text-gray-500 mb-8 text-sm">
            <li v-for="feature in featureList" :key="feature.title" class="flex items-start text-left justify-center gap-2">
              <Icon name="material-symbols:check-rounded" class="text-blue-500" />
              <div class="text-gray-500">
                <span class="text-blue-500">{{ feature.title }}</span>
                {{ feature.description }}
              </div>
            </li>
          </ul>

          <StripeCreateSessionForm
            :checkout-status="pricingQuery.data.value?.checkoutStatus || null"
            :subscription-status="pricingQuery.data.value?.subscriptionStatus || SubscriptionStatus.not_subscribed"
            class="flex flex-col items-center gap-4"
          />

          <!-- Note -->
          <div class="text-gray-500 text-xs text-center mt-6">
            {{ t('No hidden fees. Cancel or pause anytime.') }}
            <A class="underline text-brown-500 border-b-2 border-transparent focus:border-blue-500 focus:outline-none" href="/legal/terms-of-service">{{ t('Terms apply.') }}</A>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
