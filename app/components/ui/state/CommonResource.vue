<script setup lang="ts" generic="T">
import { t } from '@psitta/vue'
import type { Resource } from '~/components/framework/types'

const props = withDefaults(defineProps<{
  for: Resource<T>
  emptyCondition?: boolean
  notFoundCondition?: boolean
  emptyMessage?: string
  notFoundMessage?: string
  centeredErrorFallback?: boolean
}>(), {
  emptyCondition: undefined,
  notFoundCondition: undefined,
})
</script>

<template>
  <Resource
    :for="props.for"
    :empty-condition="emptyCondition"
    :not-found-condition="notFoundCondition"
  >
    <template #loading>
      <div class="py-4 w-full flex justify-center">
        <Spinner class="loading-sm text-orange-500" />
      </div>
    </template>

    <template #error="{ disabled, loading, isRetryAvailable, onRetry }">
      <CommonErrorFallback
        :centered="centeredErrorFallback"
        :disabled="disabled"
        :loading="loading"
        :is-retry-available="isRetryAvailable"
        @retry="onRetry"
      />
    </template>

    <template #empty>
      <slot name="empty">
        <p class="text-gray-500 text-sm py-2 px-6 text-center">
          {{ emptyMessage || t('No results found.') }}
        </p>
      </slot>
    </template>

    <template #not-found>
      <slot name="not-found">
        <p class="text-gray-500 text-sm py-2 px-6 text-center">
          {{ notFoundMessage || t('No results found.') }}
        </p>
      </slot>
    </template>

    <template #default>
      <slot />
    </template>
  </Resource>
</template>
