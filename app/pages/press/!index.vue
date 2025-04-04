<script setup lang="ts">
import { T, t } from '@psitta/vue'
import queryKeys from '~/queryKeys'
import { SubscriptionStatus } from '~~/db/schema'

useAutoRedirect()

const {
  data,
  isLoading,
  isError,
  refetch,
} = await useServerQuery(`/api/payment/stripe/pricing-data`, {
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
          <h1 class="text-5xl mb-4 sm:text-6xl max-w-lg tracking-wide">
            {{ t("Talk to Learn. Learn to Talk.") }}
          </h1>

          <p class="mb-8 text-xl sm:text-2xl mx-auto max-w-lg">
            <T
              text="Practice real-world {EnglishSkillsWithAICharacters}  tailored to your learning goals. Simple, intuitive, and fun!"
              :values="{
                EnglishSkillsWithAICharacters: true,
              }"
            >
              <template #EnglishSkillsWithAICharacters>
                <span class="text-gradient-7">
                  {{ t('English skills with AI characters') }}
                </span>
              </template>
            </T>
          </p>

          <Resource :loading="isLoading" :error="isError">
            <template #loading>
              <div class="w-full h-full flex items-center justify-center mb-4">
                <Spinner class="text-gray-800" />
              </div>
            </template>

            <template #error>
              <ErrorFallback :loading="isLoading" centered class="mb-4" @retry="refetch" />
            </template>

            <template #default>
              <StripeCreateSessionForm :checkout-status="data?.checkoutStatus || null" :subscription-status="data?.subscriptionStatus || SubscriptionStatus.not_subscribed" class="flex items-center justify-center" />
            </template>
          </Resource>
        </div>
      </div>

      <div class="absolute bottom-4 right-1/2 translate-x-1/2 text-black z-30">
        <a
          href="#features"
          class="no-underline flex flex-col gap-2 items-center"
        >
          {{ t("Learn more") }}
          <Icon
            name="arrow_downward"
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
          <Icon name="chat" class="text-6xl" />
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
              <Icon name="translate" class="text-6xl" />
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

          <div class="drop-shadow-2xl relative z-[10] mx-auto">
            <div class="mockup-phone border-blue-500">
              <div class="camera" />
              <div class="display bg-white">
                <div class="artboard artboard-demo phone-1 mt-24">
                  <img src="/screenshots/app_chat_max_nova.png" alt="Discover" class="w-full h-auto">
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
          <Icon name="person_search" class="text-6xl" />
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
          <div class="mockup-window border border-none bg-gray-50 text-black">
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
              <Icon name="engineering" class="text-6xl" />
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
          <Icon name="person_add" class="text-6xl" />
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

    <section class="w-full relative p-8">
      <h2 class="mx-auto text-4xl text-gray-800 mb-6 max-w-lg flex flex-wrap justify-center items-center gap-1">
        <Icon name="subscriptions" class="text-6xl" />
        {{ t('Pricing') }}
      </h2>

      <Pricing />
    </section>
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
