<script setup lang="ts">
import type { Node } from "../../../types"

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
