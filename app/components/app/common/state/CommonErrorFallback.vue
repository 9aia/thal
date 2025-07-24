<script setup lang="ts">
import { T } from '@psitta/vue'

defineProps<{
  loading?: boolean
  disabled?: boolean
  isRetryAvailable?: boolean
}>()

const emit = defineEmits<{
  (e: 'retry'): void
}>()

const { t } = useI18nExperimental()
</script>

<template>
  <div
    class="w-full sm:w-auto sm:h-auto"
  >
    <h1 class="text-error text-sm mb-2">
      {{ t('Oops! Something Went Wrong') }}
    </h1>

    <p class="text-gray-600 text-sm mb-2">
      {{ t('An unexpected error has occurred.') }}
    </p>

    <div v-if="isRetryAvailable" class="mb-4">
      <KeepAlive>
        <Button
          class="btn btn-warning btn-soft"
          :disabled="disabled"
          :loading="loading"
          icon="material-symbols:refresh-rounded"

          :reset-in="3"
          @click="emit('retry')"
        >
          {{ t('Try again') }}
        </Button>
      </KeepAlive>
    </div>

    <p class="text-xs text-gray-600">
      <T text="If the problem persists, please {reportIssue}." :values="{ reportIssue: 'true' }">
        <template #reportIssue>
          <A
            target="_blank" :localize="false" href="https://forms.gle/UyGBzPrBeNfFgwLD6"
            class="text-warning underline"
          >
            {{ t('report the issue here') }}
          </A>
        </template>
      </T>
    </p>
  </div>
</template>
