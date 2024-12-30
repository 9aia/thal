<script setup lang="ts">
const props = defineProps<{
  loading?: boolean
  error?: boolean
  disableFirstLoading?: boolean
}>()

const emit = defineEmits<{
  (e: "execute"): void
}>()

const { disabled, retry } = useRetry(() => emit("execute"))

const isFirstLoading = ref(props.loading)

watch(() => props.loading, (value) => {
  if (!value)
    isFirstLoading.value = false
})
</script>

<template>
  <GenericLoading v-if="disableFirstLoading ? loading : isFirstLoading" />
  <GenericError v-else-if="!!error || loading" :disabled="disabled" :loading="loading" @retry="retry" />
  <slot v-else />
</template>
