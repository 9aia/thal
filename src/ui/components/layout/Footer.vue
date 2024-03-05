<script setup lang="ts">
import Icon from '../display/Icon.vue'
import { T, t } from '~/lib/psitta/vue'
import A from '~/src/base/components/A.vue'

const sections = [
  {
    title: 'Links',
    items: [
      { title: 'Home', href: '/' },
      { title: 'About', href: '/about' },
    ],
  },
  {
    title: 'Support',
    items: [
      { title: 'Give us feedback', href: '' },
      { title: 'Report a problem', href: '' },
    ],
  },
  {
    title: 'Legal',
    items: [
      { title: 'Terms of Service', href: '/terms' },
      { title: 'Privacy Policy', href: '/privacy' },
    ],
  },
]
</script>

<template>
  <footer
    class="sticky top-[100vh] footer footer-center pt-8 pb-4 sm:pt-16 bg-slate-900 text-base-content"
  >
    <div class="mx-auto max-w-[800px] px-4 w-full gap-12 grid mb-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 flex flex-col">
      <div class="w-full">
        <h5 class="text-sm text-slate-500 font-bold mb-2 uppercase flex">
          {{ t(sections[0].title) }}
        </h5>
        <ul class="flex flex-col justify-start">
          <li v-for="(item, i) in sections[0].items" :key="i" class="flex">
            <A :href="item.href" class="text-xl link link-primary font-bold">
              {{ t(item.title) }}
            </A>
          </li>
        </ul>
      </div>

      <div class="w-full">
        <h5 class="text-sm text-slate-500 font-bold mb-2 uppercase flex">
          {{ t(sections[1].title) }}
        </h5>
        <ul class="flex flex-col justify-start">
          <li v-for="(item, i) in sections[1].items" :key="i" class="flex">
            <A :href="item.href" class="text-xl link link-primary font-bold">
              {{ t(item.title) }}
            </A>
          </li>
        </ul>
      </div>
      <div class="w-full">
        <h5 class="text-sm text-slate-500 font-bold mb-2 uppercase flex">
          {{ t(sections[2].title) }}
        </h5>
        <ul class="flex flex-col justify-start">
          <li v-for="(item, i) in sections[2].items" :key="i" class="flex">
            <A :href="item.href" class="text-xl link link-primary font-bold">
              {{ t(item.title) }}
            </A>
          </li>
        </ul>
      </div>
    </div>

    <p class="px-4 py-4 text-primary w-full flex items-center sm:justify-center gap-1">
      <T
        text="{year} - Developed by {teamName}"
        :values="{ year: new Date().getFullYear(), teamName: 'Maratongue' }"
        class="flex items-center gap-1"
      >
        <template #teamName="slotProps">
          <A
            href="/about"
            class="font-bold flex items-center gap-1"
          >
            <Icon name="directions_run" label="amor" class="" />
            {{ slotProps.teamName }}
          </A>
        </template>
      </T>
    </p>
  </footer>
</template>
