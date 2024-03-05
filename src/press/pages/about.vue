<script setup lang="ts">
import Icon from '~/src/ui/components/display/Icon.vue'
import { t } from '~/lib/i18n'
import A from '~/src/base/components/A.vue'

const { data } = await useFetch('/api/test')

const items = [
  {
    title: 'Feasibility',
    text: 'We develop realistic and sustainable solutions to meet the needs of users and ensure financial stability.',
  },
  {
    title: 'Innovation',
    text: 'We constantly seek new ideas and approaches to evolve our application and offer creative solutions to users.',
  },
  {
    title: 'Continuous Improvement',
    text: 'Committing to ongoing refinement and enhancement of the app.',
  },
]

const team = [
  {
    name: 'Luis Float',
    logo: '/luisfloat-logo-full-bleed-black.png',
    role: 'Founder | Developer',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque consequuntur quod eos veniam. Porro, eveniet nobis, eaque ex nostrum fugiat animi aliquid dolore labore laboriosam sunt repellendus eum quo consequuntur!',
    links: [
      { icon: 'globe', href: 'https://x.com/luisfloat' },
      { icon: 'globe', href: 'https://luisfloat.com' },
    ],
  },
  {
    name: 'Vinicius Emidio Bosi',
    logo: '/vinicenter-logo-full-bleed-black.png',
    role: 'Contributor | Developer',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate libero ex tenetur non nobis voluptatibus incidunt recusandae praesentium perspiciatis nostrum.',
    links: [
      { icon: 'globe', href: 'https://x.com/vinicenter' },
      { icon: 'globe', href: 'https://vinicenter.com' },
    ],
  },
]
</script>

<template>
  <div class="flex flex-col">
    <div class="hero bg-white min-h-[300px]">
      <div class="hero-content text-center">
        <div class="max-w-5xl">
          <h2 class="text-center mb-2 text-gray-500 font-bold italic">
            {{ t("Our mission") }}

            {{ data }}
          </h2>
          <p class="text-3xl max-w-2xl sm:text-5xl text-primary text-center">
            {{
              t(
                "Transforming English learning with AI-powered personalization.",
              )
            }}
          </p>
        </div>
      </div>
    </div>

    <section class="pb-20 bg-white">
      <div class="px-4 max-w-[800px] mx-auto mt-16 gap-6 grid grid-cols-1 sm:grid-cols-2">
        <div>
          <h2 class="text-slate-800 text-4xl font-bold mb-4">
            {{ t("Our values") }}
          </h2>

          <p class="text-md text-gray-800">
            {{
              t(
                "They represent what we stand for and guide our approach to building technology for our customers.",
              )
            }}
          </p>
        </div>

        <div>
          <div class="flex flex-col gap-4">
            <div v-for="(item, i) in items" :key="i" class="collapse collapse-plus border border-primary">
              <input type="radio" name="my-accordion-3" value="checked">
              <div class="collapse-title text-slate-800 font-bold text-xl">
                {{ t(item.title) }}
              </div>
              <div class="collapse-content text-slate-900">
                <p>{{ item.text }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="pb-20 bg-slate-300">
      <div class="px-4 max-w-[800px] mx-auto mt-16">
        <h2 class="text-slate-800 text-center text-4xl font-bold mb-4">
          {{ t("Our team") }}
        </h2>

        <div>
          <p class="text-md text-gray-800 mb-8">
            {{
              t(
                "Our team is small but mighty. Comprised of passionate individuals dedicated to revolutionizing English language learning through innovative technology, we are committed to bringing you the best possible experience.",
              )
            }}
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="(item, i) in team" :key="i" class="card w-full !bg-transparent border border-slate-800 shadow-xl image-full">
            <figure class="p-24">
              <img :src="item.logo" alt="Logo">
            </figure>
            <div class="card-body">
              <div>
                <h2 class="card-title text-slate-800 font-bold">
                  {{ t(item.name) }}
                </h2>
                <p class="text-slate-900">
                  {{ t(item.role) }}
                </p>
              </div>
              <p class="text-slate-900">
                {{ t(item.description) }}
              </p>

              <div class="card-actions justify-end flex-wrap gap-2">
                <A v-for="(link, i) in item.links" :key="i" :localize="false" :href="link.href">
                  <Icon>{{ link.icon }}</Icon>
                </A>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- <section class="mt-10">
      <div
        class="max-w-4xl md:mx-auto mt-20 gap-8 mb-20 px-4 grid grid-cols-1 md:grid-cols-2"
      >
        <h2 class="text-4xl text-center mb-4">
          {{ t("Our team") }}
        </h2>

        <div>
          <p class="text-center text-gray-800 mb-8">
            {{
              t(
                "Our team is small but mighty. Comprised of passionate individuals dedicated to revolutionizing English language learning through innovative technology, we are committed to bringing you the best possible experience.",
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
              >
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
              >
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
    </section> -->
  </div>
</template>
