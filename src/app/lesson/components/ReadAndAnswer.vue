<script setup lang="ts">
import { useListener } from "#design/composables/useListener";
import { useMedia } from "#design/composables/useMedia";
import { ref } from "vue";

const select = defineModel();
const props = defineProps<{
  text: string;
  question?: string;
  alternatives: string[];
  correct?: any;
}>();
const btn = ref<HTMLButtonElement>();

useListener("keydown", (e: any) => {
  const num = e.key as number;

  if (!(num >= 1 && num <= props.alternatives.length)) {
    return;
  }

  btn.value?.focus();
  select.value = num - 1;
});

const isTouchable = useMedia("(pointer: coarse) and (hover: none)");
</script>

<template>
  <h1 class="text-2xl font-bold mb-4">Leia e responda:</h1>

  <p class="text-xl mb-4">
    {{ text }}
  </p>

  <p v-if="question" class="text-xl mb-4">
    {{ question }}
  </p>

  <ul class="flex flex-col gap-2">
    <li v-for="(alternative, i) in alternatives" class="w-full">
      <button
        ref="btn"
        @click="select = i"
        class="w-full flex justify-center gap-2 border rounded-lg text-center p-2"
        :class="{
          'border-teal-500 bg-teal-500/20': select === i,
          'border-gray-400': select !== i,
        }"
      >
        <div
          v-if="!isTouchable"
          class="bg-base-200 rounded-md px-2"
        >
          {{ i + 1 }}
        </div>

        {{ alternative }}

        <div />
      </button>
    </li>
  </ul>
</template>
