<script setup lang="ts">
import Icon from '#lib/daisy/components/display/Icon.vue'
import { usePageContext } from '#lib/vike/composables/usePageContext'

const pageContext = usePageContext()

const items = [
  { id: 'learn', name: 'Aprender', icon: 'book', href: '/learn' },
  { id: 'practice', name: 'Praticar', icon: 'exercise', href: '/practice' },
  { id: 'rank', name: 'Rank', icon: 'trophy', href: '/rank' },
  { id: 'profile', name: 'Perfil', icon: 'face', href: '/profile' },
]
</script>

<template>
  <div class="drawer lg:drawer-open">
    <input id="my-drawer" type="checkbox" class="drawer-toggle">
    <div class="drawer-content p-4">
      <slot />
      <label for="my-drawer" class="btn btn-primary drawer-button">Open drawer</label>
    </div>
    <div class="drawer-side">
      <label
        for="my-drawer"
        aria-label="close sidebar"
        class="drawer-overlay"
      />

      <ul
        class="flex flex-col gap-2 menu p-4 w-80 min-h-full bg-base-200 text-xl text-base-content"
      >
        <li
          class="text-2xl hover:bg-transparent rounded-lg flex-row flex items-center gap-2 mb-2"
        >
          <h1 class="w-full">
            <Icon class="text-primary text-4xl w-auto h-auto">
              directions_run
            </Icon>
            Maratongue
          </h1>
        </li>

        <li
          v-for="item in items"
          :key="item.id"
          class="rounded-lg border-2"
          :class="{
            'border-primary text-black':
              pageContext.urlPathname === item.href,
            'border-transparent': pageContext.urlPathname !== item.href,
          }"
        >
          <a :href="item.href">
            <Icon>{{ item.icon }}</Icon>
            {{ item.name }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
