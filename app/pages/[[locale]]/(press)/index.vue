<script setup lang="ts">
import { getConfig } from '@psitta/core'
import { T, t, useLocale } from '@psitta/vue'
import { AccordionRoot } from 'reka-ui'
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

const pricingQuery = usePricingQuery()
await pricingQuery.suspense()

const redirectUrl = useRedirectUrl()
const locale = useLocale()

const flowAccordion = ref<string[]>([])
const beyondAccordion = ref<string[]>([])

function scrollToLastItem(value: string[]) {
  if (value.length === 0)
    return
  const lastItem = value[value.length - 1]
  const item = document.getElementById(lastItem)
  if (item) {
    item.scrollIntoView({ behavior: 'smooth' })
  }
}

watch(flowAccordion, scrollToLastItem)
watch(beyondAccordion, scrollToLastItem)

const quotes = computed(() => [
  {
    quote: t('Thal is a brilliant step forward, offering an intuitive, AI-powered conversational space that genuinely makes English learning feel like a real interaction.'),
    author: 'Google Gemini',
    url: 'https://gemini.google.com',
    icon: 'logos:google-icon',
  },
  {
    quote: t('Thal feels like WhatsApp met Duolingo at a café and decided to raise an AI-powered polyglot baby — playful, personal, and smart enough to teach while it listens. 🧠💬🌍'),
    author: 'ChatGPT',
    url: 'https://chatgpt.com',
    icon: 'logos:openai-icon',
  },
  {
    quote: t('Thal is a promising, innovative approach to language learning, blending AI-driven personalization with engaging, real-world dialogue simulation.'),
    author: 'xAI Grok',
    url: 'https://grok.com',
    icon: 'logos:x',
  },
])
</script>

<template>
  <div class="w-full">
    <div class="absolute w-full h-full">
      <div class="relative top-0 bottom-0 w-full h-full" style="height: calc(100dvh - 64px);">
        <div class="absolute bottom-4 right-1/2 translate-x-1/2 text-black z-30">
          <A
            href="#learn-more-1"
            :localize="false"
            class="flex md:hidden no-underline flex-col gap-2 items-center px-3 py-2 rounded-3xl focus:outline-2 focus:outline-offset-2 focus:outline-primary"
          >
            {{ t("Learn more") }}
            <Icon
              name="material-symbols:arrow-downward-rounded"
              class="flex items-center justify-center text-4xl"
            />
          </A>
          <A
            href="#learn-more-2"
            :localize="false"
            class="hidden md:flex no-underline flex-col gap-2 items-center px-3 py-2 rounded-3xl focus:outline-2 focus:outline-offset-2 focus:outline-primary"
          >
            {{ t("Learn more") }}
            <Icon
              name="material-symbols:arrow-downward-rounded"
              class="flex items-center justify-center text-4xl"
            />
          </A>
        </div>
      </div>
    </div>

    <section
      class="relative flex gap-4 items-center justify-center flex-col md:flex-row mx-auto max-w-[800px] md:py-0"
      style="min-height: calc(100dvh - 64px);"
    >
      <div
        class="md:w-1/2 px-4 w-full h-full flex flex-col justify-center items-center overflow-hidden bg-white"
        style="height: calc(100dvh - 64px);"
      >
        <div class="z-10 flex flex-col justify-center items-center md:items-start">
          <h2 class="text-5xl max-w-lg text-black mb-6">
            Thal
          </h2>

          <p class="text-black text-center md:text-left max-w-3xl text-2xl mb-6">
            <T
              text="Learn {English} like you’re texting a friend—not studying for a test."
              :values="{
                English: true,
                JustChat: true,
              }"
            >
              <template #English>
                <span class="text-blue-500">
                  {{ t('English') }}
                  <span class="mr-[0.1ch]" />
                </span>
              </template>

              <template #JustChat>
                <span class="text-blue-500">
                  {{ t('Just Chat') }}
                </span>
              </template>
            </T>
          </p>
        </div>

        <CommonResource
          :for="pricingQuery"
          common-error-fallback-class="*:justify-center *:items-center"
        >
          <StripeCreateSessionForm
            :checkout-status="pricingQuery.data.value?.checkoutStatus || null"
            :subscription-status="pricingQuery.data.value?.subscriptionStatus || SubscriptionStatus.not_subscribed"
            class="flex w-full items-center md:items-start justify-center z-10"
            button-class="md:mx-0"
            @submit="() => redirectUrl = '/app'"
          />
        </CommonResource>
      </div>

      <div class="md:w-1/2" />

      <div id="learn-more-1" class="scroll-mt-12 static md:absolute md:right-0 p-4 md:p-0 md:pr-4 drop-shadow-2xl z-1 md:w-fit md:flex md:items-center md:justify-end">
        <div class="mockup-phone border-white rounded-4xl p-2 bg-white w-full md:w-fit left-1/2">
          <div class="mockup-phone-display bg-white rounded-2xl w-fit h-min">
            <img
              :src="`/screenshots/chat_${locale}.png`"
              :alt="t('Screenshot of a chat interface with a character named \'Zarina\', displaying a conversation with both English and Portuguese messages.')"
              class="w-full md:w-[317.2px] h-auto aspect-[195/422]"
            >
          </div>
        </div>
      </div>
    </section>

    <section
      id="learn-more-2"
      class="scroll-mt-12 bg-white px-4 py-12 space-y-8 max-w-[800px] mx-auto"
    >
      <h2 class="text-4xl text-gradient bg-radial-[at_bottom] to-black from-red-500 mb-6 flex flex-wrap sm:justify-center items-center gap-1 pb-2">
        {{ t("Let's Be Honest. The Old Way of Learning English Is Broken.") }}
      </h2>

      <p class="text-black mb-6">
        {{ t('Courses, apps, and tutors... You\'ve been there.') }}
      </p>

      <ul class="flex flex-col gap-2 mb-6">
        <li class="flex gap-2 items-center justify-left">
          <Icon name="material-symbols:check-rounded" class="text-red-500" />
          {{ t('Memorizing vocab you forget by lunch.') }}
        </li>

        <li class="flex gap-2 items-center justify-left">
          <Icon name="material-symbols:check-rounded" class="text-red-500" />
          {{ t('Chatting robots with the charm of a toaster.') }}
        </li>

        <li class="flex gap-2 items-center justify-left">
          <Icon name="material-symbols:check-rounded" class="text-red-500" />
          {{ t('Freezing up, scared to sound like an idiot.') }}
        </li>
      </ul>

      <p class="text-black">
        {{ t('It\'s not you. It\'s the missing method. You\'re trying to learn a river by studying a glass of water.') }}
      </p>
    </section>

    <section class="bg-white px-4 py-12 space-y-8 max-w-[800px] mx-auto">
      <div class="bg-radial-[at_bottom] from-blue-50 to-gray-50 rounded-3xl p-12 max-w-3xl mx-auto">
        <h2 class="text-2xl sm:text-4xl text-black mb-6 flex flex-wrap justify-center md:justify-start items-center gap-1">
          {{ t("What Makes Thal Different?") }}
        </h2>

        <ul class="flex flex-col gap-2 mb-6">
          <li class="flex gap-2 items-center justify-left">
            <Icon name="material-symbols:check-rounded" class="text-blue-500" />
            {{ t('You\'re not embarrassing yourself. You\'re improving your confidence.') }}
          </li>

          <li class="flex gap-2 items-center justify-left">
            <Icon name="material-symbols:check-rounded" class="text-blue-500" />
            {{ t('You\'re not memorizing rules. You\'re building intuition.') }}
          </li>

          <li class="flex gap-2 items-center justify-left">
            <Icon name="material-symbols:check-rounded" class="text-blue-500" />
            {{ t('You\'re not practicing boring exercises. You\'re having conversations.') }}
          </li>

          <li class="flex gap-2 items-center justify-left">
            <Icon name="material-symbols:check-rounded" class="text-blue-500" />
            {{ t('You\'re not nervous. You\'re relaxed and having fun.') }}
          </li>
        </ul>

        <p class="text-black">
          {{ t('More than an app. This is your new way to learn English.') }}
        </p>
      </div>
    </section>

    <section class="site-container bg-white space-y-8 max-w-[800px] mx-auto">
      <h2 class="text-4xl text-black mb-8 flex flex-wrap sm:justify-center items-center gap-1">
        {{ t("Your Path to Flow in 3 Steps") }}
      </h2>

      <AccordionRoot v-model="flowAccordion" class="space-y-2" collapsible>
        <AccordionItem
          id="engaging-conversations"
          value="engaging-conversations"
          class="scroll-mt-14"
        >
          <template #header>
            <Icon name="material-symbols:auto-awesome-outline-rounded" />
            <div class="flex flex-col gap-1 items-start">
              {{ t('Find Your Interests') }}
            </div>
          </template>

          <p class="text-sm text-black mb-6">
            {{ t('Discover AI characters—from sarcastic philosophers to expert space engineers. Your perfect conversation partner is waiting for you.') }}
          </p>

          <div class="drop-shadow-2xl w-full relative z-[10]">
            <div class="mockup-window rounded-3xl border-none bg-white text-black">
              <div class="flex justify-center bg-cyan-950">
                <img
                  :src="`/screenshots/discover_${locale}.png`"
                  :alt="t('Screenshot of the \'Discover Characters\' screen, showing a search bar, character categories, and a list of AI characters with their names and short descriptions.')"
                  class="w-[800px] h-auto aspect-[1023/766]"
                >
              </div>
            </div>
          </div>
        </AccordionItem>

        <AccordionItem
          id="instant-help"
          value="instant-help"
          class="scroll-mt-14"
        >
          <template #header>
            <Icon name="material-symbols:chat-outline-rounded" />
            <div class="flex flex-col gap-1 items-start">
              {{ t('Just Talk') }}
            </div>
          </template>

          <p class="text-sm text-black mb-6">
            {{ t('Start a conversation about anything. The character listens, understands, and responds. It\'s spontaneous, unpredictable, and real.') }}
          </p>

          <div class="drop-shadow-2xl w-full relative z-[10] mx-auto">
            <div class="mockup-window rounded-3xl border-none bg-white text-black">
              <div class="flex justify-center bg-cyan-950">
                <img
                  :src="`/screenshots/chat_desktop_${locale}.png`"
                  :alt="t('Screenshot of the Thal app\'s chat interface, showing a list of recent conversations on the left and an active chat with \'Supergirl\' on the right, featuring conversational exchanges and AI interaction.')"
                  class="w-[800px] h-auto aspect-[59/41]"
                >
              </div>
            </div>
          </div>
        </AccordionItem>

        <AccordionItem
          id="discover-characters"
          value="discover-characters"
          class="scroll-mt-14"
        >
          <template #header>
            <Icon name="material-symbols:person-search-outline-rounded" />
            <div class="flex flex-col gap-1 items-start">
              {{ t('Absorb & Adapt') }}
            </div>
          </template>

          <p class="text-sm text-black mb-6">
            {{ t("Get instant, in-chat help: translations, suggestions, and gentle fixes. Your brain absorbs the patterns naturally as you chat.") }}
          </p>

          <!-- TODO: add image for corrector -->
        </AccordionItem>

        <p class="text-sm text-black">
          {{ t('And that\'s it. Repeat. Repeat. Repeat. And your English will improve naturally!') }}
        </p>
      </AccordionRoot>
    </section>

    <section class="bg-white px-4 py-12 space-y-8 max-w-[800px] mx-auto">
      <h2 class="text-4xl text-center text-black mb-8 flex flex-wrap sm:justify-center items-center gap-1">
        {{ t("This Isn\'t a Chatbot. It\'s a Conversation Platform.") }}
      </h2>

      <p class="text-sm text-black">
        {{ t('Thal is different. It understands you and pushes you just enough to grow. It\'s designed not to test your memory, but to build your conversational muscle. We\'re using AI to create something beautifully human.') }}
      </p>

      <p class="text-sm text-black">
        {{ t('You can go beyond the basics:') }}
      </p>

      <AccordionRoot v-model="beyondAccordion" class="space-y-2" collapsible>
        <AccordionItem
          id="create-your-own"
          value="create-your-own"
          class="scroll-mt-16"
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

          <div class="drop-shadow-2xl w-full flex flex-col sm:flex-row gap-4 justify-between max-w-none">
            <div class="mockup-window rounded-3xl border-none bg-white text-black">
              <div class="flex justify-center bg-cyan-950">
                <img
                  :src="`/screenshots/build_character_before_${locale}.png`"
                  :alt="t('Screenshot showing an \'Edit Character\' screen for \'Bruce J.\', displaying a character description, AI-generated persona, and chat instructions.')"
                  class="w-[800px] sm:w-[calc(400px-var(--spacing)*4)] h-auto aspect-[215/477]"
                >
              </div>
            </div>

            <div class="mockup-window rounded-3xl border-none bg-white text-black">
              <div class="flex justify-center bg-cyan-950">
                <img
                  :src="`/screenshots/build_character_after_${locale}.png`"
                  :alt="t('Screenshot of an \'Edit Character\' screen, showing the character \'Batman (Cynical)\' with a description of a disillusioned hero and instructions for interaction.')"
                  class="w-[800px] sm:w-[calc(400px-var(--spacing)*4)] h-auto aspect-[215/477]"
                >
              </div>
            </div>
          </div>
        </AccordionItem>

        <AccordionItem
          id="save-your-favorite"
          value="save-your-favorite"
          class="scroll-mt-16"
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
                <img
                  :src="`/screenshots/contact_${locale}.png`"
                  :alt="t('Screenshot showing a \'New Contact\' form for \'Water Bottle\' and the chat interface with the same character.')"
                  class="w-[800px] h-auto aspect-[4/3]"
                >
              </div>
            </div>
          </div>
        </AccordionItem>
      </AccordionRoot>
    </section>

    <!-- TODO: Social Proof -->

    <section class="bg-white px-4 pt-12 space-y-8 max-w-[800px] mx-auto">
      <h2 class="text-4xl text-center text-black mb-8 flex flex-wrap sm:justify-center items-center gap-1">
        {{ t("Even the AIs Are Obsessed") }}
      </h2>

      <div class="bg-radial-[at_bottom] from-yellow-50 to-gray-50 rounded-3xl p-12 max-w-3xl mx-auto space-y-8">
        <div v-for="quote in quotes" :key="quote.author" class="flex gap-4 items-start">
          <Icon :name="quote.icon" class="text-blue-500 text-2xl mt-1" />

          <div>
            <p class="text-black italic">
              "{{ quote.quote }}"
            </p>

            <p class="text-black italic">
              — <A :localize="false" class="hover:underline border-b-2 border-transparent focus:border-blue-500 focus:outline-none" :href="quote.url" target="_blank">{{ quote.author }}</A>
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
