<script setup lang="ts">
import { onMounted, defineSlots, ref } from 'vue'

defineProps<{
  defaultAsFallback?: boolean
}>()

const slots = defineSlots<{
  default(): any
  fallback(): any
}>()

const component = ref()

onMounted(() => {
  component.value = slots.default
})
const isDev = import.meta.env.DEV;
</script>

<template>
  <component v-if="component && !isDev" :is="component" />

  <template v-else>
    <slot v-if="defaultAsFallback" name="default" />
    <slot v-else name="fallback" />
  </template>
</template>
