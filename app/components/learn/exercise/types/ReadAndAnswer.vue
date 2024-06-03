<script setup lang="ts">
import { t } from "@psitta/vue"
import type { ExerciseQA } from "~/types"

const props = defineProps<ExerciseQA>()
const select = defineModel<number>()

useSingleResponse(props, select)
</script>

<template>
  <h1 class="text-2xl font-bold mb-4 text-slate-800">
    {{ t("Read and answer:") }}
  </h1>

  <p class="text-xl mb-4 text-slate-900">
    {{ text }}
  </p>

  <p v-if="question" class="text-xl text-slate-900 mb-4">
    {{ question }}
  </p>

  <ul class="flex flex-col gap-2">
    <li v-for="(alternative, i) in alternatives" :key="i" class="w-full">
      <ExerciseButton
        v-model="select"
        :selected="select === i"
        :alternative="alternative"
        :i="i"
      />
    </li>
  </ul>
</template>
