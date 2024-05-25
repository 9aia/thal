<script setup lang="ts">
import type { Level } from "../../../types"

defineProps<{
  levels: Level[]
}>()
</script>

<template>
  <ul class="timeline timeline-vertical flex flex-col">
    <li v-for="(level, i) in levels" :key="level.id">
      <TimelineItem :is="level" :i="i" :levels="levels" />
    </li>
  </ul>
</template>
