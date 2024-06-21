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
      >
        <template #default="{ modalState, setState }">
          <Modal
            :model-value="modalState"
            confirm-text="Continue"
            @update:model-value="setState"
            @confirm="setState(false)"
          >
            <h1 class="text-2xl mx-auto mb-2">
              {{ t(level.name) }}
            </h1>
            <p v-if="level.description">
              {{ t(level.description) }}
            </p>

            <h2 class="mt-4 mb-2 uppercase font-bold text-xs">
              Example
            </h2>

            <div class="border border-gray-500 rounded-lg p-4">
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, possimus.</p>
            </div>
          </Modal>
        </template>
      </TimelineItem>

      <hr
        v-if="index < unit.levels.length - 1"
        :class="{ 'bg-primary': unit.levels[index + 1].active && level.active }"
      >
    </li>
  </ul>
</template>
