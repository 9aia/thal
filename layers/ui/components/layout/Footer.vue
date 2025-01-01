<script setup lang="ts">
import { T, t } from '@psitta/vue'
import Link from '~~/layers/ui/components/navigation/Link.vue'

const user = useUser()

interface SectionItem {
  title: string
  items: Array<{ title: string, href: string, target?: string, localize?: boolean } | null>
}

const sections = computed<SectionItem[]>(() => [
  {
    title: 'Links',
    items: [
      { title: 'Home', href: '/' },
      { title: 'About', href: '/about' },
      !user?.value?.plan ? { title: 'Pricing', href: '/pricing' } : null,
    ],
  },
  {
    title: 'Support',
    items: [
      { title: 'Give us feedback', target: '_blank', localize: false, href: 'https://forms.gle/5ePvXjrebyWGUrM26' },
      { title: 'Report a problem', target: '_blank', localize: false, href: 'https://forms.gle/ANMv7qnwTHva1k7L8' },
    ],
  },
  {
    title: 'Legal',
    items: [
      { title: 'Terms of Service', href: '/terms' },
      { title: 'Privacy Policy', href: '/privacy' },
    ],
  },
])

const localeModal = useLocaleModal()
</script>

<template>
  <footer class="sticky top-[100vh] footer footer-center pt-8 pb-4 sm:pt-16 bg-slate-900 text-base-content">
    <div class="mx-auto max-w-[800px] px-4 w-full gap-12 mb-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid flex-col">
      <div class="w-full">
        <h5 class="text-sm text-slate-500 font-bold mb-2 uppercase flex">
          {{ t(sections[0].title) }}
        </h5>
        <ul class="flex flex-col justify-start">
          <template v-for="(item, i) in sections[0].items">
            <li v-if="item" :key="i" class="flex">
              <Link v-bind="item" class="text-xl link-primary">
                {{ t(item.title) }}
              </Link>
            </li>
          </template>
        </ul>
      </div>

      <div class="w-full">
        <h5 class="text-sm text-slate-500 font-bold mb-2 uppercase flex">
          {{ t(sections[1].title) }}
        </h5>
        <ul class="flex flex-col justify-start">
          <template v-for="(item, i) in sections[1].items">
            <li v-if="item" :key="i" class="flex">
              <Link v-bind="item" class="text-xl link-primary">
                {{ t(item.title) }}
              </Link>
            </li>
          </template>
        </ul>
      </div>
      <div class="w-full">
        <h5 class="text-sm text-slate-500 font-bold mb-2 uppercase flex">
          {{ t(sections[2].title) }}
        </h5>
        <ul class="flex flex-col justify-start">
          <template v-for="(item, i) in sections[2].items">
            <li v-if="item" :key="i" class="flex">
              <Link v-bind="item" class="text-xl link-primary">
                {{ t(item.title) }}
              </Link>
            </li>
          </template>
        </ul>
      </div>
    </div>

    <p class="px-4 py-4 text-primary w-full flex items-center sm:justify-center gap-1">
      <button class="flex" @click="localeModal.open()">
        <Icon name="language" class="text-teal-500" />
      </button>

      <T
        text="{year} - Developed by {teamName}"
        :values="{ year: [new Date(), { year: 'numeric' }], teamName: 'NeoGaia Lab' }"
        class="flex items-center justify-center gap-1"
      >
        <template #teamName="slotProps">
          <Link href="https://neogaialab.github.io/" class="font-bold flex items-center gap-1">
            {{ slotProps.teamName }}
          </Link>
        </template>
      </T>
    </p>
  </footer>
</template>
