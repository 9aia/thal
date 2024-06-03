<script setup lang="ts">
import { t } from "@psitta/vue"
import { computed } from "vue"
import { BLANK } from "~/constants/exercises"
import type { ExerciseFillInTheBlank } from "~/types"

const props = defineProps<ExerciseFillInTheBlank>()
const select = defineModel<number>()
const text = computed(() => {
  if (!props.alternatives || props.correctLength === undefined)
    return undefined

  return props.text.replaceAll(BLANK, "_".repeat(props.correctLength))
})

useSingleResponse(props, select)
</script>

<template>
  <h1 class="text-2xl font-bold mb-4">
    {{ t("Fill in the blank:") }}
  </h1>

  <p class="text-xl mb-4">
    {{ text }}
  </p>

  <ul class="flex flex-col gap-2">
    <li v-for="(alternative, i) in alternatives" :key="i" class="w-full">
      <ExerciseButton v-model="select" :alternative="alternative" :i="i" />
    </li>
  </ul>
</template>
