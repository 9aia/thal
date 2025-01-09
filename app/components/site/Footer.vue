<script setup lang="ts">
import { T, t } from '@psitta/vue'
import Link from '~/components/ui/navigation/Link.vue'

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
  <footer class="sticky top-[100vh]">
    <div class="z-20 bg-gradient-footer w-full py-12 sm:py-32 ">
      <div class="mx-auto max-w-[800px] gap-12 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid flex-col">
        <div class="w-full px-4">
          <h5 class="text-2xl text-gray-900 mb-6 flex">
            {{ t(sections[0].title) }}
          </h5>
          <ul class="flex flex-col justify-start">
            <template v-for="(item, i) in sections[0].items">
              <li v-if="item" :key="i" class="flex">
                <Link v-bind="item" class="text-base !text-black">
                  {{ t(item.title) }}
                </Link>
              </li>
            </template>
          </ul>
        </div>

        <div class="w-full px-4">
          <h5 class="text-2xl text-gray-900 mb-6 flex">
            {{ t(sections[1].title) }}
          </h5>
          <ul class="flex flex-col justify-start">
            <template v-for="(item, i) in sections[1].items">
              <li v-if="item" :key="i" class="flex">
                <Link v-bind="item" class="text-base !text-black">
                  {{ t(item.title) }}
                </Link>
              </li>
            </template>
          </ul>
        </div>

        <div class="w-full px-4">
          <h5 class="text-2xl text-gray-900 mb-6 flex">
            {{ t(sections[2].title) }}
          </h5>
          <ul class="flex flex-col justify-start">
            <template v-for="(item, i) in sections[2].items">
              <li v-if="item" :key="i" class="flex">
                <Link v-bind="item" class="text-base !text-black">
                  {{ t(item.title) }}
                </Link>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </div>

    <div class="z-20 bg-white text-black w-full">
      <div class="mx-auto max-w-[800px] px-4 py-4 flex items-center justify-between">
        <div class="flex items-center justify-center gap-1">
          <button class="flex" @click="localeModal.open()">
            <Icon name="language" />
          </button>

          <T
            text="{year} - Developed by {teamName}"
            :values="{ year: [new Date(), { year: 'numeric' }], teamName: 'Gaia' }"
            class="flex items-center justify-center gap-1"
          >
            <template #teamName="slotProps">
              <Link href="https://9aia.github.io/" disable class="text-gradient-1 flex items-center gap-1">
                {{ slotProps.teamName }}
              </Link>
            </template>
          </T>
        </div>

        <div>
          <p href="/" class="flex items-center gap-1 text-black">
            Thal {{ new Date().getFullYear() }}
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style>
.bg-gradient-footer {
  background-image: radial-gradient(at center left,
      theme('colors.magenta.500'),
      theme('colors.white'));
      background-size: 100% 100%;
}

.text-gradient-1 {
  background: radial-gradient(theme('colors.green.500'), theme('colors.blue.500')) !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
  color: transparent !important;
}
</style>
