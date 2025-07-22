<script setup lang="ts" generic="T">
import { t } from '@psitta/vue'
import type { Resource } from '~/components/framework/types'

const props = withDefaults(defineProps<{
  for: Resource<T>
  emptyCondition?: boolean
  notFoundCondition?: boolean
  emptyMessage?: string
  notFoundMessage?: string
  commonErrorFallbackClass?: string
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
        :disabled="disabled"
        :loading="loading"
        :is-retry-available="isRetryAvailable"
        :class="commonErrorFallbackClass"
        @retry="onRetry"
      />
    </template>

    <template #empty>
      <slot name="empty">
        <p class="text-gray-500 text-xs py-2 px-2">
          {{ emptyMessage || t('No results found.') }}
        </p>
      </slot>
    </template>

    <template #not-found>
      <slot name="not-found">
        <p class="text-gray-500 text-xs py-2 px-2">
          {{ notFoundMessage || t('No results found.') }}
        </p>
      </slot>
    </template>

    <template #default>
      <slot />
    </template>
  </Resource>
</template>
