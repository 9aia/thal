<script setup lang="ts">
import Icon from '#lib/daisy/components/display/Icon.vue'
import { t } from '#lib/i18n'
</script>

<template>
  <div
    class="hero min-h-screen relative"
    style="background: url(''); background-size: cover"
  >
    <div class="hero-overlay bg-opacity-60 bg-white" />
    <div class="text-center text-white p-4">
      <div class="max-w-2xl">
        <h1 class="text-6xl italic font-bold text-primary max-w-lg tracking-wide">
          {{ t("Master English, Transform Your Future.") }}
        </h1>

        <p class="py-6 text-2xl text-gray-900 mx-auto max-w-lg">
          {{
            t("Learn English with Artificial Intelligence effectively and fun!")
          }}
        </p>
        <a class="btn btn-primary text-neutral-content" href="/app/explore">{{
          t("Try Maratongue")
        }}</a>
      </div>
    </div>

    <div class="absolute bottom-4 right-1/2 translate-x-1/2 text-black">
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
    class="container mx-auto py-12 max-w-md mx-auto text-center"
  >
    <h2 class="text-4xl font-bold text-primary mb-4">
      {{ t("Personalize your Learning Journey") }}
    </h2>

    <p class="text-primary-content">
      {{
        t(
          "Create your Maratongue profile in moments and start your personalized English learning journey. With advanced AI, Maratongue adapts to your learning style, making each lesson unique. Immerse yourself in a world of English adapted especially for you.",
        )
      }}
    </p>
  </section>

  <section class="overflow-y-hidden">
    <div
      class="container mx-auto py-12 max-w-[800px] max-h-[500px] md:max-h-[400px] p-4 text-center md:text-left"
    >
      <div class="flex gap-12 flex-col md:flex-row">
        <div class="mx-auto">
          <h2 class="text-4xl font-bold mb-6 max-w-sm">
            {{ t("Multiplatform Learning Experience") }}
          </h2>

          <p class="text-gray-700 max-w-sm">
            {{
              t(
                "Learn English on any device - cell phone, tablet or computer. Marathongue offers a learning experience consistent and effective, whether you're at home or on the go. Learn flexibly and conveniently, with full compatibility between devices.",
              )
            }}
          </p>
        </div>

        <div class="drop-shadow-2xl relative z-[-1] mx-auto">
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

  <section class="container mx-auto py-12 mx-auto max-w-sm text-center">
    <h2 class="text-4xl text-primary font-bold mb-6">
      {{ t("Stand out with English Proficiency") }}
    </h2>

    <p class="text-secondary-content">
      {{
        t(
          "By using Maratongue, you are preparing yourself to stand out globally. With fluent English, you open doors to opportunities international, increasing your credibility and professional visibility.",
        )
      }}
    </p>
  </section>

  <section
    class="hero min-h-screen relative"
    style="background: url(''); background-size: cover"
  >
    <div class="hero-overlay bg-opacity-60" />
    <div
      class="flex items-center justify-center w-full h-full max-w-[800px] mx-auto p-4"
    >
      <div class="mx-auto w-full flex flex-col md:flex-row">
        <div class="w-full md:w-1/2 text-center md:text-left">
          <h2 class="text-4xl font-bold mb-6 text-primary">
            {{ t("Direct and Efficient Learning") }}
          </h2>

          <p class="text-primary-content max-w-lg mb-8">
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

  <section class="w-full mx-auto py-12 text-center p-4">
    <h2 class="text-4xl text-primary-content font-bold mb-6">
      {{ t("Track your progress") }}
    </h2>

    <p class="text-primary-content max-w-lg mx-auto mb-8">
      {{
        t(
          "Monitor your progress in English with Maratongue. Receive comments snapshot and insights into your learning, allowing you to understand your strengths and areas for improvement, and make strategic decisions in your learning process.",
        )
      }}
    </p>

    <div class="drop-shadow-2xl relative z-[-1]">
      <div class="mockup-browser border bg-base-300 max-w-2xl mx-auto">
        <div class="mockup-browser-toolbar">
          <div class="input">
            https://maratongue.com
          </div>
        </div>
        <div class="flex justify-center px-4 py-16 bg-base-200 h-[400px]" />
      </div>
    </div>
  </section>

  <div
    class="hero h-96 text-neutral-content"
    style="background: url(''); background-size: cover"
  >
    <div class="hero-overlay bg-opacity-60" />
    <div class="hero-content text-center w-full">
      <div class="max-w-2xl">
        <h1 class="text-5xl font-bold mb-8">
          {{ t("Start learning now") }}
        </h1>
        <a class="btn btn-primary text-neutral-content" href="/app/explore">
          {{ t("Try Maratongue") }}</a>
      </div>
    </div>
  </div>
</template>
