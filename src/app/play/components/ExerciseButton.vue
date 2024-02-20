<script setup lang="ts">
import Kbd from "#design/components/display/Kbd.vue";
import { useMediaQuery } from "@vueuse/core";
import { ref, watch } from "vue";

const props = defineProps<{
  i: number;
  alternative: string;
}>();
const select = defineModel<number>();

const isTouchable = useMediaQuery("(pointer: coarse) and (hover: none)");
const btnEl = ref<HTMLButtonElement>();

watch(select, () => {
  if (select.value === props.i) {
    btnEl.value?.focus();
  }
});
</script>

<template>
  <button
    ref="btnEl"
    @click="select = i"
    class="w-full flex justify-center items-center gap-2 border rounded-lg text-center p-2 border-gray-400 focus:border-teal-500 focus:bg-teal-500/20"
  >
    <Kbd v-if="!isTouchable" class="kbd-sm">
      {{ i + 1 }}
    </Kbd>

    {{ alternative }}

    <div />
  </button>
</template>
