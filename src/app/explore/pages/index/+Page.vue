<script setup lang="ts">
import Icon from '#lib/daisy/components/display/Icon.vue'
import ChevronRight from '#lib/daisy/components/layout/ChevronRight.vue'
import { A, t } from '#lib/i18n'

const items = [
  { id: 'grammar', name: 'Grammar', icon: 'book', href: '/app/explore/grammar' },
  { id: 'stories', name: 'Stories', icon: 'history_edu', href: '/app/explore/stories' },
  { id: 'chat', name: 'Conversation Simulation', icon: 'chat', href: '/app/explore/chat' },
]
</script>

<template>
  <div class="max-w-lg mx-auto py-2 px-4 py-4">
    <h1 class="text-primary font-bold text-4xl mb-4">
      {{ t("Explore") }}
    </h1>

    <div class="flex gap-2 mb-4">
      <A
        href="/app/play/story/1"
        class="btn btn-primary w-fit flex items-center"
      >
        <Icon>history_edu</Icon>
        {{ t("New story") }}
      </A>
      <A
        href="/app/play/lesson"
        class="btn btn-primary w-fit flex items-center"
      >
        <Icon>book</Icon>
        {{ t("New lesson") }}
      </A>
    </div>

    <ul class="divide-y divide-base-200">
      <li v-for="item in items" :key="item.id" class="group py-4">
        <A :href="item.href" class="flex justify-between">
          <div class="flex gap-2 items-center">
            <Icon>{{ item.icon }}</Icon>
            {{ t(item.name as any) }}
          </div>
          <ChevronRight />
        </A>
      </li>
    </ul>
  </div>
</template>
