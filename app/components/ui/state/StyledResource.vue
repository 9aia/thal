<script setup lang="ts">
defineProps<{
  loading?: boolean
  error?: boolean
}>()

const emit = defineEmits<{
  (e: 'execute'): void
}>()

const { disabled, retry } = useRetry(() => emit('execute'))
</script>

<template>
  <ErrorFallback v-if="!!error" :disabled="disabled" :loading="disabled" @retry="retry" />
  <div v-else-if="loading" class="py-4 w-full flex justify-center">
    <Spinner class="loading-sm text-orange-500" />
  </div>
  <slot v-else />
</template>
