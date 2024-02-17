<script setup lang="ts">
import { t } from "#framework/i18n";

const items = [
  {
    title: "Feasibility",
    text: "We develop realistic and sustainable solutions to meet the needs of users and ensure financial stability.",
  },
  {
    title: "Innovation",
    text: "We constantly seek new ideas and approaches to evolve our application and offer creative solutions to users.",
  },
  {
    title: "Continuous Improvement",
    text: "Committing to ongoing refinement and enhancement of the app.",
  },
];
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="hero min-h-[300px]">
      <div class="hero-content text-center">
        <div class="max-w-5xl">
          <h1 class="text-center text-gray-500 font-bold italic">
            {{ t("Our mission") }}
          </h1>
          <p class="text-3xl leading-13! max-w-2xl sm:text-5xl text-primary text-center">
            {{
              t(
                "Empowering personalized English learning through AI technology."
              )
            }}
          </p>
        </div>
      </div>
    </div>

    <section class="p-4 bg-base-200">
      <div class="max-w-4xl mx-auto mt-16">
        <h1 class="text-4xl text-center mb-4">
          {{ t("Our values") }}
        </h1>
        <p class="text-center text-gray-800 mb-2">
          {{
            t(
              "They represent what we stand for and guide our approach to building technology for our customers."
            )
          }}
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div
            v-for="(item, index) in items"
            :key="index"
            class="card bg-base-100 translate-y-[100px]"
          >
            <div class="card-body">
              <h2 class="card-title text-primary">{{ t(item.title) }}</h2>
              <p class="card-text">{{ t(item.text) }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="mt-10">
      <div
        class="max-w-4xl md:mx-auto mt-20 gap-8 mb-20 px-4 grid grid-cols-1 md:grid-cols-2"
      >
        <div>
          <h1 class="text-4xl text-center mb-4">{{ t("Our team") }}</h1>

          <p class="text-center text-gray-800 mb-8">
            {{
              t(
                "Our team is small but mighty. Comprised of passionate individuals dedicated to revolutionizing English language learning through innovative technology, we are committed to bringing you the best possible experience."
              )
            }}
          </p>
        </div>

        <div
          class="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-between items-center"
        >
          <div class="mx-auto flex flex-col gap-2">
            <div class="mx-auto flex gap-2 items-center">
              <img
                src="/luisfloat-logo-full-bleed-black.png"
                width="24px"
                height="24px"
              />
              <h2 class="text-center text-2xl text-black font-medium">
                Luis Float
              </h2>
            </div>
            <p class="text-center text-1xl text-gray-600">
              {{ t("Founder & Developer") }}
            </p>
          </div>
          <div class="mx-auto flex flex-col gap-2">
            <div class="mx-auto flex gap-2 items-center">
              <img
                src="/vinicenter-logo-full-bleed-black.png"
                width="24px"
                height="24px"
                class="mr--2"
              />
              <h2 class="text-center text-2xl text-black font-medium">
                Vini Center
              </h2>
            </div>
            <p class="text-center text-1xl text-gray-600">
              {{ t("Developer") }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
