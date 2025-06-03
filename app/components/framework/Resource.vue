<script setup lang="ts">
import type { Resource } from './types'

const props = withDefaults(defineProps<{
  for: Resource
  emptyCondition?: boolean
  notFoundCondition?: boolean
}>(), {
  emptyCondition: undefined,
  notFoundCondition: undefined,
})

const { disabled, retry } = useRetry(() => props.for.refetch?.())

const data = computed(() => toValue(props.for.data))
const isLoading = computed(() => toValue(props.for.isLoading))
const isError = computed(() => toValue(props.for.isError))

const isEmpty = computed(() =>
  props.emptyCondition !== undefined
    ? props.emptyCondition
    : !data.value?.length)
const isNotFound = computed(() =>
  props.notFoundCondition !== undefined
    ? props.notFoundCondition
    : !data.value)
</script>

<template>
  <template v-if="isLoading">
    <slot name="loading" />
  </template>
  <template v-else-if="isError">
    <slot
      name="error"
      :disabled="disabled"
      :loading="isLoading"
      :is-retry-available="props.for.refetch !== undefined"
      @retry="retry"
    />
  </template>
  <slot v-else-if="Array.isArray(data) && isEmpty" name="empty" />
  <slot v-else-if="isNotFound" name="not-found" />
  <slot v-else />
</template>
