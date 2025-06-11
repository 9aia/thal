<script setup lang="ts">
import { T, t } from '@psitta/vue'
import queryKeys from '~/queryKeys'
import { SubscriptionStatus } from '~~/db/schema'

useAutoRedirect()

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
  <div class="w-full">
    <div
      class="hero relative"
      style="height: calc(100dvh - 64px - 32px);"
    >
      <div class="hero-content z-30">
        <div class="max-w-2xl flex flex-col justify-center text-center text-black">
          <h1 class="text-5xl mb-6 sm:text-6xl lg:text-7xl max-w-xl mx-auto tracking-wide">
            {{ t("Talk to Learn. Learn to Talk.") }}
          </h1>

          <p class="mb-8 text-xl sm:text-2xl mx-auto max-w-2xl ">
            <T
              text="Your new way to master {English}  — through real conversations with smart AI characters that adapt to you."
              :values="{
                English: true,
              }"
            >
              <template #English>
                <span class="text-gradient bg-linear-[12deg] from-blue-500 to-magenta-500">
                  {{ t('English') }}
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

          <p class="text-lg text-black flex items-center gap-2 mx-auto mt-4">
            {{ t('Feel the difference in your fluency from the very first chat.') }}
          </p>
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
          <Icon name="material-symbols:chat-outline-rounded" class="text-6xl" />
          {{ t("Dynamic Conversations") }}
        </h2>

        <p class="text-gray-800">
          {{
            t(
              "Practice English in interactive conversations that feel authentic and immersive. The thals adapt to your goals, while the intuitive UI offers translations and grammar corrections, helping you improve naturally as you chat.",
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
              <Icon name="material-symbols:translate-rounded" class="text-6xl" />
              {{ t("Interactive Language Assistance") }}
            </h2>

            <p class="text-gray-800 max-w-sm">
              {{
                t(
                  "Get seamless language support during your conversations. The app offers instant translations, message fixing, and more, empowering you to learn without interrupting the flow of your dialogue.",
                )
              }}
            </p>
          </div>

          <div class="relative w-full h-[568px]">
            <div class="drop-shadow-2xl z-[10] mx-auto absolute right-1/2 translate-x-1/2">
              <div class="mockup-phone border-cyan-500">
                <div class="mockup-phone-camera" />
                <div class="mockup-phone-display w-[320px] h-[568px] bg-white">
                  <div class="mt-10">
                    <img src="/screenshots/app_chat_max_nova.png" alt="Discover" class="w-full h-auto">
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
          <Icon name="material-symbols:person-search-outline-rounded" class="text-6xl" />
          {{ t("Discover Characters") }}
        </h2>

        <p class="mb-8 max-w-lg">
          {{
            t(
              "Explore a diverse range of AI-powered characters tailored to your learning goals. Whether practicing small talk, handling professional scenarios, or diving into roleplay, a character is always ready to engage.",
            )
          }}
        </p>

        <div class="drop-shadow-2xl w-full max-w-[800px] mx-auto relative z-[10] ">
          <div class="mockup-window rounded-3xl border-none bg-white text-black">
            <div class="flex justify-center bg-cyan-950">
              <img src="/screenshots/app_discover.png" alt="Discover" class="w-full h-auto">
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
              <Icon name="material-symbols:engineering-outline-rounded" class="text-6xl" />
              {{ t("Create Your Own Character") }}
            </h2>

            <p class="text-gray-800 max-w-sm">
              {{
                t(
                  "Unleash your creativity by designing characters tailored to your learning needs. Customize their personality, background, and conversation style to create a unique and engaging practice partner.",
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
          <Icon name="material-symbols:person-add-outline-rounded" class="text-6xl" />
          {{ t("Save Your Favorite Characters") }}
        </h2>

        <p class="text-gray-800 max-w-lg mx-auto mb-8">
          {{
            t(
              "Keep track of the characters you enjoy the most. Add them to your contacts for easy access to future conversations. Build your own set of companions to practice with as you progress.",
            )
          }}
        </p>
      </div>
    </section>

    <section class="w-full relative">
      <h2 class="mx-auto text-4xl text-gray-800 max-w-lg flex flex-wrap justify-center items-center gap-1">
        <Icon name="material-symbols:subscriptions-outline-rounded" class="text-6xl" />
        {{ t('Pricing') }}
      </h2>

      <p class="text-gray-800 max-w-lg mx-auto px-4 mb-8 mt-6">
        {{ t('We believe in making language learning accessible and straightforward. That’s why we offer a single plan with everything you need to improve your English.') }}
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
