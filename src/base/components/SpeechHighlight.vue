<script setup lang="ts">
import { createTextVNode } from 'vue';

const props = defineProps<{
  text: string,
  currentWord: number
}>()

const textParts = computed(() => props.text.split(" "))
</script>

<template>
  <span ref="elRef" v-for="part, j in textParts" :class="{ 'text-blue-500': j === currentWord }">
    {{ part }}
  </span>
</template>
