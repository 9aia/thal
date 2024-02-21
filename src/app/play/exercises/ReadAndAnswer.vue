<script setup lang="ts">
import { t } from '#lib/i18n'
import ExerciseButton from '../components/ExerciseButton.vue'
import useSingleResponse from '../composables/useSingleResponse'
import type { ExerciseQA } from '../types'

const props = defineProps<ExerciseQA>()
const select = defineModel<number>()
useSingleResponse(props, select)
</script>

<template>
  <h1 class="text-2xl font-bold mb-4">
    {{ t("Read and answer:") }}
  </h1>

  <p class="text-xl mb-4">
    {{ text }}
  </p>

  <p v-if="question" class="text-xl mb-4">
    {{ question }}
  </p>

  <ul class="flex flex-col gap-2">
    <li v-for="(alternative, i) in alternatives" :key="i" class="w-full">
      <ExerciseButton v-model="select" :alternative="alternative" :i="i" />
    </li>
  </ul>
</template>
