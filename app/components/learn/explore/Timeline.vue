<script setup lang="ts">
import { t } from "@psitta/vue"
import type { Level, Unit } from "../../../types"

const props = defineProps<{
  unit: Unit
}>()

function goToLevel(level: Level) {
  navigateTo(`/learn/${props.unit.slug}/${level.slug}`)
}
</script>

<template>
  <ul class="timeline timeline-vertical flex flex-col">
    <li v-for="(level, index) in unit.levels" :key="level.slug">
      <hr v-if="index !== 0" :class="{ 'bg-primary': unit.levels[index - 1].active && level.active }">

      <TimelineItem
        :level="level"
        :align="index % 2 === 0 ? 'start' : 'end'"
        @click="goToLevel(level)"
      />

      <hr
        v-if="index < unit.levels.length - 1"
        :class="{ 'bg-primary': unit.levels[index + 1].active && level.active }"
      >
    </li>
  </ul>
</template>
