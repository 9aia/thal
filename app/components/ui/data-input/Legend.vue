<script setup lang="ts">
defineProps<{
  label?: string
  mandatory?: boolean
}>()
</script>

<template>
  <legend class="fieldset-legend">
    {{ label }}
    <span
      v-if="mandatory"
      class="absolute bottom-1/2 translate-y-1/2 right-[-0.4em] text-red-500"
    >*</span>
  </legend>
</template>
