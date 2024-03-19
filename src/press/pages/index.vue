<script setup lang="ts">
import Icon from '~/src/ui/components/display/Icon.vue'
import { t } from '@psitta/vue'
</script>

<template>
  <div
    class="hero !bg-white"
    style="min-height: calc(100vh - 64px - 40px); background: url(''); background-size: cover"
  >
    <div class="hero-overlay bg-opacity-60" />
    <div class="hero-content">
      <div class="max-w-2xl text-center">
        <h1 class="text-5xl sm:text-6xl italic font-bold text-primary max-w-lg tracking-wide">
          {{ t("Master English, Transform Your Future.") }}
        </h1>

        <p class="py-6 text-xl sm:text-2xl text-slate-800 mx-auto max-w-lg">
          {{ t("Learn English with Artificial Intelligence effectively and fun!") }}
        </p>

        <A class="btn btn-primary text-neutral-content" href="/explore">{{
          t("Try Maratongue")
        }}</A>
      </div>
    </div>

    <div class="absolute bottom-4 right-1/2 translate-x-1/2 text-slate-800">
      <a
        href="#features"
        class="no-underline flex flex-col gap-2 items-center text-slate-800"
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
    class="bg-slate-300 px-4 py-12 text-center"
  >
    <div class="max-w-md mx-auto">
      <h2 class="text-4xl font-bold text-primary mb-4">
        {{ t("Personalize your Learning Journey") }}
      </h2>

      <p class="text-slate-900">
        {{
          t(
            "Create your Maratongue profile in moments and start your personalized English learning journey. With advanced AI, Maratongue adapts to your learning style, making each lesson unique. Immerse yourself in a world of English adapted especially for you.",
          )
        }}
      </p>
    </div>
  </section>

  <section class="bg-slate-300 overflow-y-hidden">
    <div
      class="mx-auto px-4 py-12 max-w-[800px] max-h-[500px] md:max-h-[400px] text-center md:text-left"
    >
      <div class="flex gap-12 flex-col md:flex-row">
        <div class="mx-auto">
          <h2 class="text-4xl text-slate-800 font-bold mb-6 max-w-sm">
            {{ t("Multiplatform Learning Experience") }}
          </h2>

          <p class="text-slate-900 max-w-sm">
            {{
              t(
                "Learn English on any device - cell phone, tablet or computer. Marathongue offers a learning experience consistent and effective, whether you're at home or on the go. Learn flexibly and conveniently, with full compatibility between devices.",
              )
            }}
          </p>
        </div>

        <div class="drop-shadow-2xl relative z-[10] mx-auto">
          <div class="mockup-phone border-primary">
            <div class="camera" />
            <div class="display">
              <div class="artboard artboard-demo phone-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="mx-auto bg-white text-center">
    <div class="px-4 py-12 mx-auto max-w-sm">
      <h2 class="text-4xl text-primary font-bold mb-6">
        {{ t("Stand out with English Proficiency") }}
      </h2>

      <p class="text-slate-900">
        {{
          t(
            "By using Maratongue, you are preparing yourself to stand out globally. With fluent English, you open doors to opportunities international, increasing your credibility and professional visibility.",
          )
        }}
      </p>
    </div>
  </section>

  <section
    class="hero min-h-screen relative !bg-white"
    style="background: url(''); background-size: cover"
  >
    <div class="hero-overlay bg-opacity-60" />
    <div
      class="flex items-center justify-center w-full h-full max-w-[800px] mx-auto p-4"
    >
      <div class="mx-auto w-full flex flex-col md:flex-row">
        <div class="w-full md:w-1/2 text-center md:text-left">
          <h2 class="text-4xl text-slate-800 font-bold mb-6">
            {{ t("Direct and Efficient Learning") }}
          </h2>

          <p class="text-slate-900 max-w-lg mx-auto mb-8">
            {{
              t(
                "With Maratongue, learning English is straightforward and hassle-free. Without the need for complex registrations, get started quickly and Focus on what really matters: your language progress English.",
              )
            }}
          </p>
        </div>
        <div class="w-full md:w-1/2" />
      </div>
    </div>
  </section>

  <section class="w-full bg-slate-300 mx-auto text-center">
    <div class="px-4 py-12">
      <h2 class="text-4xl text-primary font-bold mb-6">
        {{ t("Track your progress") }}
      </h2>

      <p class="text-slate-900 max-w-lg mx-auto mb-8">
        {{
          t(
            "Monitor your progress in English with Maratongue. Receive comments snapshot and insights into your learning, allowing you to understand your strengths and areas for improvement, and make strategic decisions in your learning process.",
          )
        }}
      </p>

      <div class="drop-shadow-2xl max-w-[800px] mx-auto relative z-[10] ">
        <div class="mockup-browser border border-slate-900 bg-slate-800 text-white">
          <div class="mockup-browser-toolbar flex relative">
            <div class="input bg-white px-4 rounded-xl text-slate-900">
              https://maratongue.com
            </div>
          </div>
          <div class="flex justify-center px-4 py-16 bg-white h-[400px]" />
        </div>
      </div>
    </div>
  </section>

  <div
    class="hero h-96 !bg-white"
    style="background: url(''); background-size: cover"
  >
    <div class="hero-overlay bg-opacity-60" />
    <div class="hero-content text-center w-full">
      <div class="">
        <h1 class="text-4xl sm:text-5xl text-slate-800 font-bold mb-8">
          {{ t("Start learning now") }}
        </h1>
        <A class="btn btn-primary text-slate-900" href="/explore">
          {{ t("Try Maratongue") }}</A>
      </div>
    </div>
  </div>
</template>
