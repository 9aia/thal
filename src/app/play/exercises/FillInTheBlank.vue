<script setup lang="ts">
import { t } from "#framework/i18n";
import { computed } from "vue";
import { BLANK } from "../constants";
import ExerciseButton from "../components/ExerciseButton.vue";
import { ExerciseFillInTheBlank } from "../types.d";
import useSingleResponse from "../composables/useSingleResponse";

const select = defineModel<number>();
const props = defineProps<ExerciseFillInTheBlank>();

const text = computed(() => {
  if (!props.alternatives || props.correctLength === undefined) return undefined;

  return props.text.replaceAll(BLANK, "_".repeat(props.correctLength));
});

useSingleResponse(props, select);
</script>

<template>
  <h1 class="text-2xl font-bold mb-4">{{ t("Fill in the blank:") }}</h1>

  <p class="text-xl mb-4">
    {{ text }}
  </p>

  <ul class="flex flex-col gap-2">
    <li v-for="(alternative, i) in alternatives" class="w-full">
      <ExerciseButton :alternative="alternative" :i="i" v-model="select" />
    </li>
  </ul>
</template>
