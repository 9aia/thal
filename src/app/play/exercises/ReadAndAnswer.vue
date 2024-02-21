<script setup lang="ts">
import { t } from "#lib/i18n";
import ExerciseButton from "../components/ExerciseButton.vue";
import useSingleResponse from "../composables/useSingleResponse";
import { ExerciseQA } from "../types";

const select = defineModel<number>();
const props = defineProps<ExerciseQA>();

useSingleResponse(props, select);
</script>

<template>
  <h1 class="text-2xl font-bold mb-4">{{ t("Read and answer:") }}</h1>

  <p class="text-xl mb-4">
    {{ text }}
  </p>

  <p v-if="question" class="text-xl mb-4">
    {{ question }}
  </p>

  <ul class="flex flex-col gap-2">
    <li v-for="(alternative, i) in alternatives" class="w-full">
      <ExerciseButton :alternative="alternative" :i="i" v-model="select" />
    </li>
  </ul>
</template>
