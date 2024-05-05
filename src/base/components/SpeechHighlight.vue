<script setup lang="ts">
const props = defineProps<{
  text: string
  currentWord: number
}>()

const textParts = computed(() => props.text.split(" "))
</script>

<template>
  <span v-for="part, j in textParts" :key="j" :class="{ 'text-blue-500': j === currentWord }">
    {{ part }}
  </span>
</template>
