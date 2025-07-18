<script setup lang="ts">
import { T, t, useLocale } from '@psitta/vue'
import { getConfig } from '@psitta/core'
import queryKeys from '~/queryKeys'
import { SubscriptionStatus } from '~~/db/schema'

definePageMeta({
  layout: 'site',
  layoutTransition: false,
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

const redirectUrl = useRedirectUrl()

const locale = useLocale()
</script>

<template>
  <div class="w-full">
    <div
      class="hero relative bg-white overflow-hidden"
      style="height: calc(100dvh - 64px);"
    >
      <div
        class="px-4 py-12 text-center md:text-left w-full max-w-[800px] mx-auto"
      >
        <div class="flex gap-4 flex-col md:flex-row">
          <div class="mx-auto flex flex-col items-center md:items-start">
            <h2 class="text-5xl sm:text-4xl md:text-6xl max-w-lg lg:text-6xl text-black mb-6 flex flex-wrap justify-center md:justify-start items-center gap-1">
              {{ t("Talk to Learn. Learn to Talk.") }}
            </h2>

            <p class="text-black max-w-3xl text-2xl mb-6">
              <T
                text="Your head is already wired for {English}. Thal is the conversation that activates it. No textbooks. No grammar drills. {JustChat}."
                :values="{
                  English: true,
                  JustChat: true,
                }"
              >
                <template #English>
                  <span class="text-blue-500">
                    {{ t('English') }}
                  </span>
                </template>

                <template #JustChat>
                  <span class="text-blue-500">
                    {{ t('Just Chat') }}
                  </span>
                </template>
              </T>
            </p>

            <CommonResource
              :for="pricingQuery"
              centered-error-fallback
            >
              <StripeCreateSessionForm
                :checkout-status="pricingQuery.data.value?.checkoutStatus || null"
                :subscription-status="pricingQuery.data.value?.subscriptionStatus || SubscriptionStatus.not_subscribed"
                class="flex items-center justify-center"
                @submit="() => redirectUrl = '/app'"
              />
            </CommonResource>
          </div>

          <div class="relative w-full hidden md:block">
            <div class="drop-shadow-2xl z-[10] mx-auto absolute md:translate-y-1/2 right-1/2 translate-x-1/2 md:right-0 md:bottom-1/2 md:translate-x-0">
              <div class="mockup-phone border-white rounded-4xl p-2 bg-white">
                <div class="mockup-phone-display w-[317.2px] h-[687.7px] bg-white rounded-2xl">
                  <img :src="`/screenshots/chat_${locale}.png`" alt="Discover" class="w-[317.2px] h-[687.7px]">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="absolute bottom-8 right-1/2 translate-x-1/2 text-black z-30">
        <A
          href="#features"
          :localize="false"
          class="no-underline flex flex-col gap-2 items-center px-6 py-2 rounded-3xl focus:outline-2 focus:outline-offset-2 focus:outline-primary"
        >
          {{ t("Learn more") }}
          <Icon
            name="material-symbols:arrow-downward-rounded"
            class="flex items-center justify-center text-4xl"
          />
        </A>
      </div>
    </div>

    <section id="features" class="bg-white px-4 py-12 space-y-8 max-w-[800px] mx-auto">
      <h2 class="text-4xl text-gradient bg-radial-[at_bottom] from-black to-red-500 mb-6 flex flex-wrap sm:justify-center items-center gap-1 pb-2">
        {{ t("Let's Be Honest. Language Apps Are Broken.") }}
      </h2>

      <p class="text-black mb-6">
        {{ t('You\'ve tried them all.') }}
      </p>

      <ul class="flex flex-col gap-2 mb-6">
        <li class="flex gap-2 items-center justify-left">
          <Icon name="material-symbols:check-rounded" class="text-red-500" />
          {{ t('Memorizing vocabulary lists you instantly forget.') }}
        </li>

        <li class="flex gap-2 items-center justify-left">
          <Icon name="material-symbols:check-rounded" class="text-red-500" />
          {{ t('Awkward, scripted dialogues with emotionless robots.') }}
        </li>

        <li class="flex gap-2 items-center justify-left">
          <Icon name="material-symbols:check-rounded" class="text-red-500" />
          {{ t('The constant fear of sounding stupid in a real conversation.') }}
        </li>

        <li class="flex gap-2 items-center justify-left">
          <Icon name="material-symbols:check-rounded" class="text-red-500" />
          {{ t('Translating every single sentence in your head, word by painful word.') }}
        </li>
      </ul>

      <p class="text-black">
        {{ t('It\'s not you. It\'s the method. You\'re trying to learn a river by studying a glass of water.') }}
      </p>
    </section>

    <section class="bg-white px-4 py-12 space-y-8 max-w-[800px] mx-auto">
      <div class="bg-radial-[at_bottom] from-blue-50 to-gray-50 rounded-3xl p-12 max-w-3xl mx-auto">
        <h2 class="text-4xl text-black mb-6 flex flex-wrap justify-center md:justify-start items-center gap-1">
          {{ t("What if fluency wasn't just studied, but practiced and acquired?") }}
        </h2>

        <ul class="flex flex-col gap-2 mb-6">
          <li class="flex gap-2 items-center justify-left">
            <Icon name="material-symbols:check-rounded" class="text-blue-500" />
            {{ t('Imagine learning flows as naturally as texting a friend.') }}
          </li>

          <li class="flex gap-2 items-center justify-left">
            <Icon name="material-symbols:check-rounded" class="text-blue-500" />
            {{ t('Where you can make mistakes without judgment, get corrected without shame, and have conversations so engaging you forget you\'re even learning.') }}
          </li>

          <li class="flex gap-2 items-center justify-left">
            <Icon name="material-symbols:check-rounded" class="text-blue-500" />
            {{ t('You\'re not memorizing rules. You\'re building intuition.') }}
          </li>

          <li class="flex gap-2 items-center justify-left">
            <Icon name="material-symbols:check-rounded" class="text-blue-500" />
            {{ t('You\'re not practicing dialogues. You\'re having conversations.') }}
          </li>
        </ul>

        <p class="text-black text-center">
          {{ t('This isn\'t an app. It\'s your new English-speaking reality.') }}
        </p>
      </div>
    </section>

    <section class="site-container bg-white space-y-8">
      <h2 class="text-4xl text-black mb-8 flex flex-wrap sm:justify-center items-center gap-1">
        {{ t("Your Path to Flow in 3 Steps") }}
      </h2>

      <AccordionRoot class="mx-auto max-w-3xl space-y-6" collapsible>
        <Accordion
          value="engaging-conversations"
          class="overflow-visible relative z-0"
        >
          <template #header>
            <Icon name="material-symbols:auto-awesome-outline-rounded" />
            <div class="flex flex-col gap-1 items-start">
              {{ t('Find Your Vibe') }}
            </div>
          </template>

          <p class="text-sm text-black mb-6">
            {{ t('Discover or create AI characters—from sarcastic philosophers to expert space engineers. Your perfect conversation partner is waiting.') }}
          </p>

          <div class="drop-shadow-2xl w-full relative z-[10] max-w-[800px] mx-auto">
            <div class="mockup-window rounded-3xl border-none bg-white text-black">
              <div class="flex justify-center bg-cyan-950">
                <img :src="`/screenshots/discover_${locale}.png`" alt="Discover" class="w-full h-auto">
              </div>
            </div>
          </div>
        </Accordion>

        <Accordion
          value="instant-help"
          class="overflow-visible relative z-0"
        >
          <template #header>
            <Icon name="material-symbols:chat-outline-rounded" />
            <div class="flex flex-col gap-1 items-start">
              {{ t('Just Talk') }}
            </div>
          </template>

          <p class="text-sm text-black mb-6">
            {{ t('Start a conversation about anything. The AI listens, understands, and responds. It\'s spontaneous, unpredictable, and real.') }}
          </p>

          <div class="drop-shadow-2xl w-full relative z-[10] mx-auto">
            <div class="mockup-window rounded-3xl border-none bg-white text-black">
              <div class="flex justify-center bg-cyan-950">
                <img :src="`/screenshots/chat_desktop_${locale}.png`" alt="Discover" class="w-full h-auto">
              </div>
            </div>
          </div>
        </Accordion>

        <Accordion
          value="discover-characters"
          class="overflow-visible relative z-0"
        >
          <template #header>
            <Icon name="material-symbols:person-search-outline-rounded" />
            <div class="flex flex-col gap-1 items-start">
              {{ t('Absorb & Adapt') }}
            </div>
          </template>

          <p class="text-sm text-black mb-6">
            {{ t("Get instant, in-chat help: translations, suggestions, and gentle fixes. Your brain absorbs the patterns naturally, just like a child does.") }}
          </p>

          <!-- TODO: add image for corrector -->
        </Accordion>

        <p class="text-sm text-black">
          {{ t('And that\'s it. Repeat. Repeat. Repeat. And you\'ll be speaking English!') }}
        </p>
      </AccordionRoot>
    </section>

    <section class="bg-white px-4 py-12 space-y-8 max-w-[800px] mx-auto">
      <h2 class="text-4xl text-black mb-8 flex flex-wrap sm:justify-center items-center gap-1">
        {{ t("This Isn\'t A Chatbot. It\'s A Conversation Engine.") }}
      </h2>

      <p class="text-sm text-black">
        {{ t('Standard apps recite scripts. Thal\'s AI is different. It remembers your conversations, understands you, and pushes you just enough to grow. It\’s designed not to test your memory, but to build your conversational muscle. We\'re using AI to create something beautifully human.') }}
      </p>

      <p class="text-sm text-black">
        {{ t('You can go beyond the basics:') }}
      </p>

      <AccordionRoot class="mx-auto max-w-3xl space-y-6" collapsible>
        <Accordion
          value="create-your-own"
          class="overflow-visible relative z-0"
        >
          <template #header>
            <Icon name="material-symbols:person-add-outline-rounded" />
            <div class="flex flex-col gap-1 items-start">
              {{ t('Create Your Own Characters') }}
            </div>
          </template>

          <p class="text-sm text-black mb-6">
            {{ t('Just describe their personality and behavior in a short prompt — our AI will instantly bring them to life in seconds, ready for dynamic and engaging conversations.') }}
          </p>

          <div class="flex gap-4 drop-shadow-2xl w-full relative z-[10] mx-auto">
            <div class="mockup-window rounded-3xl border-none bg-white text-black">
              <div class="flex justify-center bg-cyan-950">
                <img :src="`/screenshots/build_character_before_${locale}.png`" alt="Discover" class="w-full h-auto">
              </div>
            </div>

            <div class="mockup-window rounded-3xl border-none bg-white text-black">
              <div class="flex justify-center bg-cyan-950">
                <img :src="`/screenshots/build_character_after_${locale}.png`" alt="Discover" class="w-full h-auto">
              </div>
            </div>
          </div>
        </Accordion>

        <Accordion
          value="save-your-favorite"
          class="overflow-visible relative z-0"
        >
          <template #header>
            <Icon name="material-symbols:person-add-outline-rounded" />
            <div class="flex flex-col gap-1 items-start">
              {{ t('Save Your Favorite Characters') }}
            </div>
          </template>

          <p class="text-sm text-black mb-6">
            {{ t('Keep your favorite thals in a contact list for easy access and consistent practice.') }}
          </p>

          <div class="drop-shadow-2xl w-full relative z-[10] mx-auto">
            <div class="mockup-window rounded-3xl border-none bg-white text-black">
              <div class="flex justify-center bg-cyan-950">
                <img :src="`/screenshots/contact_${locale}.png`" alt="Discover" class="w-full h-auto">
              </div>
            </div>
          </div>
        </Accordion>
      </AccordionRoot>
    </section>

    <!-- TODO: Social Proof -->

    <section class="bg-white px-4 space-y-8 max-w-[800px] mx-auto">
      <h2 class="text-4xl text-black mb-8 flex flex-wrap sm:justify-center items-center gap-1">
        {{ t("What the best AIs think about Thal?") }}
      </h2>

      <div class="bg-radial-[at_bottom] from-yellow-50 to-gray-50 rounded-3xl p-12 max-w-3xl mx-auto">
        <div class="flex gap-4 items-start mb-6">
          <Icon name="logos:google-icon" class="text-blue-500 text-2xl mt-1" />

          <div>
            <p class="text-black italic">
              "{{ t('Thal is a brilliant step forward, offering an intuitive, AI-powered conversational space that genuinely makes English learning feel like a real interaction.') }}"
            </p>

            <p class="text-black italic">
              — <A :localize="false" href="https://gemini.google.com" target="_blank">Google Gemini</A>
            </p>
          </div>
        </div>

        <div class="flex gap-4 items-start mb-6">
          <Icon name="logos:openai-icon" class="text-gray-500 text-2xl mt-1" />

          <div>
            <p class="text-black italic">
              "{{ t('Thal feels like WhatsApp met Duolingo at a café and decided to raise an AI-powered polyglot baby — playful, personal, and smart enough to teach while it listens. 🧠💬🌍') }}"
            </p>

            <p class="text-black italic">
              — <A :localize="false" href="https://chatgpt.com" target="_blank">ChatGPT</A>
            </p>
          </div>
        </div>

        <div class="flex gap-4 items-start mb-6">
          <Icon name="logos:x" class="text-blue-500 text-2xl mt-1" />

          <div>
            <p class="text-black italic">
              "{{ t('Thal is a promising, innovative approach to language learning, blending AI-driven personalization with engaging, real-world dialogue simulation.') }}"
            </p>

            <p class="text-black italic">
              — <A :localize="false" href="https://grok.com" target="_blank">xAI Grok</A>
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="w-full px-12 py-24">
      <FooterCta />
    </section>
  </div>
</template>
