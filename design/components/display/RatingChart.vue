<script setup lang="ts">
import Icon from "#design/components/display/Icon.vue";
import { computed } from "vue";
import { Analytics } from "~/support/pages/admin/@id/@view/+data";

const props = defineProps<Analytics>();

const scores = [
  {
    title: "Muito satisfeito",
    barClass: "bg-cyan-500",
    iconClass: "text-cyan-500",
    icon: "sentiment_very_satisfied",
  },
  {
    title: "Satisfeito",
    barClass: "bg-green-500",
    iconClass: "text-green-500",
    icon: "sentiment_satisfied",
  },
  {
    title: "Neutro",
    barClass: "bg-yellow-500",
    iconClass: "text-yellow-500",
    icon: "sentiment_neutral",
  },
  {
    title: "Insatisfeito",
    barClass: "bg-orange-500",
    iconClass: "text-orange-500",
    icon: "sentiment_dissatisfied",
  },
  {
    title: "Muito insatisfeito",
    barClass: "bg-red-500",
    iconClass: "text-red-500",
    icon: "sentiment_very_dissatisfied",
  },
];
const levelPercs = computed(() => props.levelPercs.reverse());
const levels = computed(() => props.levels.reverse());
</script>

<template>
  <div class="flex flex-col gap-1">
    <div class="flex gap-3 items-center" v-for="(level, i) in levelPercs">
      <div class="flex gap-1 items-center">
        {{ levels[i] }}
        <Icon :name="scores[i].icon" :class="scores[i].iconClass" />
      </div>

      <div class="flex w-full gap-1 items-center relative">
        <div class="w-full h-6"></div>

        <div
          class="absolute z-1 top-0 left-0 w-full h-full rounded-md bg-gray-200"
        ></div>
        <div
          class="absolute z-2 top-0 left-0 w-full h-full rounded-md"
          :class="scores[i].barClass"
          :style="{ width: level + '%' }"
        ></div>
        <div class="absolute z-2 flex gap-2 top-0 left-0 w-full h-full px-2">
          {{ scores[i].title }}
          <span class="w-[120px]">({{ level.toFixed(1) }}%)</span>
        </div>
      </div>
    </div>
  </div>
</template>
