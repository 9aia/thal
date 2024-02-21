<script setup lang="ts">
import Icon from './Icon.vue'
import type { TimelineItem } from './types'

defineProps<{
  items: TimelineItem[]
}>()
</script>

<template>
  <ul class="timeline timeline-vertical">
    <li v-for="(item, i) in items" :key="item.id">
      <hr v-if="i !== 0" :class="{ 'bg-primary': item.active }">
      <div
        class="timeline-box"
        :class="{
          'timeline-start': item.position === 'start' || !item.position,
          'timeline-end': item.position === 'end',
        }"
      >
        {{ item.name }}
      </div>
      <div
        v-if="item.icon"
        class="timeline-middle flex justify-center items-center rounded-full w-5 h-5"
        :class="{
          'bg-primary': item.active,
          'bg-base-300 text-base-300': !item.active,
        }"
      >
        <Icon class="!text-base">
          {{ item.icon }}
        </Icon>
      </div>
      <hr
        v-if="i < items.length - 1"
        :class="{ 'bg-primary': items[i + 1]?.active }"
      >
    </li>
  </ul>
</template>
