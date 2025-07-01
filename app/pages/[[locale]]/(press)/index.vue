<script setup lang="ts">
import { T, t, useLocale } from '@psitta/vue'
import { getConfig } from '@psitta/core'
import queryKeys from '~/queryKeys'
import { SubscriptionStatus } from '~~/db/schema'

definePageMeta({
  layout: 'site',
  layoutTransition: false,
  pageTransition: false,
  validate(route) {
    if (!route.params.locale)
      return true
    return getConfig().locales.includes(route.params.locale as string)
  },
})

useAutoRedirect()

const headers = useRequestHeaders(['cookie'])
const pricingQuery = useServerQuery({
  queryFn: () => $fetch('/api/payment/stripe/pricing-data', {
    headers,
  }),
  queryKey: queryKeys.pricingData,
  staleTime: 0,
})

const locale = useLocale()
</script>

<template>
  <div class="w-full">
    <div
      class="hero relative"
      style="height: calc(100dvh - 64px - 32px);"
    >
      <div class="hero-content z-30">
        <div class="max-w-2xl flex flex-col justify-center text-center text-black">
          <h1 class="text-4xl mb-6 sm:text-6xl lg:text-7xl max-w-xl mx-auto tracking-wide">
            {{ t("Talk to Learn. Learn to Talk.") }}
          </h1>

          <p class="mb-8 text-lg sm:text-2xl mx-auto max-w-2xl ">
            <T
              text="Chat, laugh, learn, and LEVEL UP your {English} with AI characters who never get tired, never judge, and always keep it 💯."
              :values="{
                English: true,
              }"
            >
              <template #English>
                <span class="text-gradient bg-linear-[12deg] from-blue-500 to-magenta-500">
                  {{ t('English') }}
                  <span class="mr-[0.5ch]" />
                </span>
              </template>
            </T>
          </p>

          <CommonResource :for="pricingQuery" centered-error-fallback>
            <StripeCreateSessionForm
              :checkout-status="pricingQuery.data.value?.checkoutStatus || null"
              :subscription-status="pricingQuery.data.value?.subscriptionStatus || SubscriptionStatus.not_subscribed"
              class="flex items-center justify-center"
            />
          </CommonResource>
        </div>
      </div>

      <div class="absolute bottom-4 right-1/2 translate-x-1/2 text-black z-30">
        <a
          href="#features"
          class="no-underline flex flex-col gap-2 items-center px-6 py-2 rounded-3xl focus:outline-2 focus:outline-offset-2 focus:outline-primary"
        >
          {{ t("Learn more") }}
          <Icon
            name="material-symbols:arrow-downward-rounded"
            class="flex items-center justify-center text-4xl"
          />
        </a>
      </div>
    </div>

    <section
      id="features"
      class="bg-white px-4 py-12 text-center"
    >
      <div class="max-w-lg mx-auto">
        <h2 class="text-4xl text-gray-800 mb-6 flex flex-col items-center gap-1">
          <Icon name="material-symbols:chat-rounded" class="text-6xl text-gray-100" />
          {{ t("Practice real English with interactive chats.") }}
        </h2>

        <p class="text-gray-800">
          {{
            t(
              "Practice real English with interactive chats that feel natural and immersive. Thals adapt to your goals while the smart UI helps you with translations and grammar corrections as you go.",
            )
          }}
        </p>
      </div>
    </section>

    <section class="bg-white overflow-y-hidden">
      <div
        class="mx-auto px-4 py-12 max-w-[800px] max-h-[755px] md:max-h-[423px] text-center md:text-left"
      >
        <div class="flex gap-12 flex-col md:flex-row">
          <div class="mx-auto flex flex-col items-center md:items-start">
            <h2 class="text-4xl text-gray-800 mb-6 flex flex-wrap justify-center sm:justify-start items-center gap-1">
              <Icon name="material-symbols:translate-rounded" class="text-6xl text-gray-100" />
              {{ t("Get instant help while you chat.") }}
            </h2>

            <p class="text-gray-800 max-w-sm">
              {{ t("Real-time translations, message fixing, listening tools and more — all built in. Learn while keeping the conversation flowing.") }}
            </p>
          </div>

          <div class="relative w-full h-[568px]">
            <div class="drop-shadow-2xl z-[10] mx-auto absolute right-1/2 translate-x-1/2">
              <div class="mockup-phone border-cyan-500">
                <div class="mockup-phone-camera" />
                <div class="mockup-phone-display w-[320px] h-[568px] bg-white">
                  <div class="mt-10">
                    <img :src="`/screenshots/chat_${locale}.png`" alt="Discover" class="w-full h-auto">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="mx-auto text-black text-center">
      <div class="px-4 py-12 mx-auto flex flex-col items-center justify-center">
        <h2 class="text-4xl text-gray-800 mb-6 max-w-lg flex flex-wrap justify-center items-center gap-1">
          <Icon name="material-symbols:person-search-rounded" class="text-6xl text-gray-100" />
          {{ t("Discover characters.") }}
        </h2>

        <p class="mb-8 max-w-lg">
          {{
            t(
              "Whether you're into casual chats, professional scenarios, or full-on RPG, there's always a Thal ready to talk.",
            )
          }}
        </p>

        <div class="drop-shadow-2xl w-full max-w-[800px] mx-auto relative z-[10] ">
          <div class="mockup-window rounded-3xl border-none bg-white text-black">
            <div class="flex justify-center bg-cyan-950">
              <img :src="`/screenshots/discover_${locale}.png`" alt="Discover" class="w-full h-auto">
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-white overflow-y-hidden">
      <div
        class="mx-auto px-4 py-12 max-w-[800px] max-h-[755px] md:max-h-[423px] text-center md:text-left"
      >
        <div class="flex gap-12 flex-col md:flex-row">
          <div class="mx-auto flex flex-col items-center md:items-start">
            <h2 class="text-4xl text-gray-800 mb-6 flex flex-wrap justify-center sm:justify-start items-center gap-1">
              <Icon name="material-symbols:engineering-rounded" class="text-6xl text-gray-100" />
              {{ t("Create your own.") }}
            </h2>

            <p class="text-gray-800 max-w-sm">
              {{
                t(
                  "Just describe their personality and behavior in a short prompt — our AI will instantly bring them to life in seconds, ready for dynamic and engaging conversations.",
                )
              }}
            </p>
          </div>

          <div class="drop-shadow-2xl relative z-[10] mx-auto w-1/2" />
        </div>
      </div>
    </section>

    <section class="w-full mx-auto text-center">
      <div class="px-4 py-12 flex flex-col items-center justify-center">
        <h2 class="text-4xl text-gray-800 mb-6 max-w-lg flex flex-wrap justify-center items-center gap-1">
          <Icon name="material-symbols:person-add-rounded" class="text-6xl text-gray-100" />
          {{ t("Save Your Favorite.") }}
        </h2>

        <p class="text-gray-800 max-w-lg mx-auto mb-8">
          {{
            t(
              "Keep your favorite Thals in a contact list for easy access and consistent practice.",
            )
          }}
        </p>
      </div>
    </section>

    <section class="w-full relative">
      <h2 class="mx-auto text-4xl text-gray-800 max-w-lg flex flex-wrap justify-center items-center gap-1">
        <Icon name="material-symbols:subscriptions-rounded" class="text-6xl text-gray-100" />
        {{ t('Pricing') }}
      </h2>

      <p class="text-gray-800 max-w-lg mx-auto px-4 mb-8 mt-6 text-center">
        {{ t('Simple. Transparent. Powerful.') }}
      </p>

      <div class="w-full px-4">
        <div class="max-w-2xl mx-auto">
          <Price />

          <div class="w-full mx-auto max-w-sm mt-6">
            <p class="text-gray-500 text-sm mb-2 mt-4 text-center">
              {{ t('What’s included:') }}
            </p>

            <ul class="flex flex-col mx-auto text-gray-500 space-y-1 mb-4 text-sm">
              <li class="flex justify-center gap-2">
                <Icon name="material-symbols:check-rounded" class="text-blue-500" />
                <div class="gap-2">
                  <span class="text-blue-500">{{ t('Engaging Conversations:') }}</span>
                  {{ t('Chat with AI-powered characters anytime, anywhere.') }}
                </div>
              </li>

              <li class="flex justify-center gap-2">
                <Icon name="material-symbols:check-rounded" class="text-blue-500" />
                <div class="gap-2">
                  <span class="text-blue-500">{{ t('Interactive Assistance:') }}</span>
                  {{ t('Translations, corrections, and listening while chatting.') }}
                </div>
              </li>

              <li class="flex justify-center gap-2">
                <Icon name="material-symbols:check-rounded" class="text-blue-500" />
                <div class="gap-2">
                  <span class="text-blue-500">{{ t('Personalized Characters:') }}</span>
                  {{ t('Create, discover and save characters for tailored learning.') }}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="w-full p-12 mb-16">
      <FooterCta />
    </section>
  </div>
</template>
