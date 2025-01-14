<script setup lang="ts">
import { T, t } from '@psitta/vue'
</script>

<template>
  <div class="w-full">
    <div
      class="hero relative"
      style="height: calc(100dvh - 64px);"
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

          <A class="bg-cyan-500 text-black flex justify-center items-center px-6 py-3 w-fit rounded-full mx-auto" href="/app">{{
            t("Start chatting")
          }}</A>
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
        <h2 class="text-4xl text-gray-800 mb-4">
          {{ t("Dynamic Conversations") }}
        </h2>

        <p class="text-gray-800">
          {{
            t(
              "Practice English in interactive conversations that feel authentic and immersive. Thal adapts to your language level and style, providing real-time suggestions, translations, and grammar fixes so you can improve naturally as you chat.",
            )
          }}
        </p>
      </div>
    </section>

    <section class="bg-white overflow-y-hidden">
      <div
        class="mx-auto px-4 py-12 max-w-[800px] max-h-[500px] md:max-h-[400px] text-center md:text-left"
      >
        <div class="flex gap-12 flex-col md:flex-row">
          <div class="mx-auto">
            <h2 class="text-4xl text-gray-800 mb-6 flex flex-wrap items-center gap-1">
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
              <div class="display">
                <div class="artboard artboard-demo phone-1 bg-cyan-950" />
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
              "Explore a diverse range of AI-powered characters designed to match your learning goals. Whether you want to practice small talk, tackle professional scenarios, or dive into roleplay, there's always a character ready to help you learn.",
            )
          }}
        </p>

        <div class="drop-shadow-2xl w-full max-w-[800px] mx-auto relative z-[10] ">
          <div class="mockup-browser border border-gray-300 bg-white text-cyan-500">
            <div class="mockup-browser-toolbar flex relative ">
              <div class="!bg-white px-4 rounded-xl text-gray-800">
                thal.9aia.com
              </div>
            </div>
            <div class="flex justify-center px-4 py-16 bg-cyan-950 h-[400px]" />
          </div>
        </div>
      </div>
    </section>

    <section
      class="hero relative"
      style="background: url(''); background-size: cover"
    >
      <div class="hero-overlay bg-opacity-60" />
      <div
        class="flex items-center justify-center w-full h-full max-w-[800px] mx-auto p-4"
      >
        <div class="mx-auto w-full flex flex-col md:flex-row">
          <div class="w-full md:w-1/2 text-center md:text-left">
            <h2 class="text-4xl text-gray-800 mb-6 max-w-lg flex flex-wrap items-center gap-1">
              <Icon name="engineering" class="text-6xl" />
              {{ t("Create Your Own Character") }}
            </h2>

            <p class="text-gray-800 max-w-lg mx-auto">
              {{
                t(
                  "Unleash your creativity by designing characters tailored to your learning needs. Customize their personality, background, and conversation style to create a unique and engaging practice partner.",
                )
              }}
            </p>
          </div>
          <div class="w-full md:w-1/2" />
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
