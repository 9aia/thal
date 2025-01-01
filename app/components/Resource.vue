<script setup lang="ts">
const props = defineProps<{
  loading?: boolean
  error?: boolean
}>()

const emit = defineEmits<{
  (e: 'execute'): void
}>()

const { disabled, retry } = useRetry(() => emit('execute'))
</script>

<template>
  <template v-if="loading">
    <slot name="loading" />
  </template>
  <template v-else-if="props.error">
    <slot name="error" :disabled="disabled" :loading="loading" @retry="retry" />
  </template>
  <slot v-else />
</template>
