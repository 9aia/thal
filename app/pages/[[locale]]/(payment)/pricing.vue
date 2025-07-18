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
  <div class="site-container w-full min-h-screen bg-white flex items-center justify-center px-4 py-12">
    <div class="max-w-4xl mx-auto text-center">
      <!-- Main Headline -->
      <h1 class="text-4xl md:text-5xl lg:text-6xl font-normal text-black mb-6">
        The best of
        <span class="text-blue-600">Thal AI</span>
        and learning all in one membership
      </h1>

      <!-- Sub-headline -->
      <p class="text-xl md:text-2xl text-black mb-12 max-w-3xl mx-auto">
        Unlock expanded access, premium features, personalized learning, and more.
      </p>

      <!-- CTA Button -->
      <div class="mb-8">
        <StripeCreateSessionForm
          :checkout-status="pricingQuery.data.value?.checkoutStatus || null"
          :subscription-status="pricingQuery.data.value?.subscriptionStatus || SubscriptionStatus.not_subscribed"
          class="flex flex-col items-center gap-4"
        />
      </div>

      <!-- Pricing Card -->
      <div class="max-w-2xl mx-auto">
        <div class="bg-white border border-blue-200 rounded-2xl p-8 shadow-sm">
          <!-- Card Header -->
          <div class="text-left mb-6">
            <h2 class="text-2xl font-semibold text-blue-600 mb-2">
              Thal Pro¹
            </h2>
            <div class="text-lg text-black">
              <span class="line-through text-gray-600">{{ pricingQuery.data.value?.price ? `R$ ${pricingQuery.data.value.price}/mo` : 'R$ 96,99/mo' }}</span>
              <span class="text-blue-600 ml-2">R$ 0 for the first month</span>
            </div>
          </div>

          <!-- Features List -->
          <div class="space-y-4 text-left">
            <div class="flex items-start gap-3">
              <Icon name="material-symbols:check-rounded" class="text-blue-600 text-xl mt-0.5 flex-shrink-0" />
              <div>
                <span class="font-semibold text-black">Engaging Conversations:</span>
                <span class="text-gray-700"> Chat with AI-powered characters anytime, anywhere with unlimited access to our most capable models.</span>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <Icon name="material-symbols:check-rounded" class="text-blue-600 text-xl mt-0.5 flex-shrink-0" />
              <div>
                <span class="font-semibold text-black">Interactive Assistance:</span>
                <span class="text-gray-700"> Translations, corrections, and listening while chatting to enhance your learning experience.</span>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <Icon name="material-symbols:check-rounded" class="text-blue-600 text-xl mt-0.5 flex-shrink-0" />
              <div>
                <span class="font-semibold text-black">Personalized Characters:</span>
                <span class="text-gray-700"> Create, discover and save characters for tailored learning experiences.</span>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <Icon name="material-symbols:check-rounded" class="text-blue-600 text-xl mt-0.5 flex-shrink-0" />
              <div>
                <span class="font-semibold text-black">Advanced Features:</span>
                <span class="text-gray-700"> Access to premium conversation tools, character customization, and learning analytics.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Note -->
      <p class="text-sm text-gray-600 mt-8 max-w-2xl mx-auto">
        No hidden fees. Cancel or pause anytime.
        <A href="/legal/terms" class="text-blue-600 underline">Terms apply.</A>
      </p>
    </div>
  </div>
</template>
