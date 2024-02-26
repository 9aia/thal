<script setup lang="ts">
import TimelineItem from './TimelineItem.vue'
import type { Node } from '../types.d'

defineProps<{
  items: Node[]
}>()
</script>

<template>
  <ul class="timeline timeline-vertical flex flex-col">
    <li v-for="(item, i) in items" :key="item.id">
      <TimelineItem :is="item" :i="i" :items="items" />
    </li>
  </ul>
</template>
