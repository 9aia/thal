<script setup lang="ts">
import { T, useI18n } from '@psitta/vue'

defineProps<{
  loading?: boolean
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'retry'): void
}>()

const { t } = useI18n()
</script>

<template>
  <div class="absolute p-4 w-full sm:p-0 sm:w-auto sm:h-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <div class="card sm:w-96">
      <div class="card-body">
        <h1 class="card-title">
          {{ t('Oops! Something Went Wrong') }}
        </h1>

        <p>
          {{ t('An unexpected error has occurred. Please try again later.') }}
        </p>

        <p class="mt-2">
          <T text="If the problem persists, please {reportIssue}." :values="{ reportIssue: 'true' }">
            <template #reportIssue>
              <A
                target="_blank" :localize="false" :href="t('https://forms.gle/ANMv7qnwTHva1k7L8')"
                class="text-warning underline"
              >{{ t('report the issue here') }}</A>
            </template>
          </T>
        </p>

        <div class="card-actions">
          <Btn class="btn-warning btn-outline mt-2 py-2 flex gap-1" :disabled="disabled" :loading="loading" :reset-in="3000" @click="emit('retry')">
            {{ t('Try again') }}
          </Btn>
        </div>
      </div>
    </div>
  </div>
</template>
