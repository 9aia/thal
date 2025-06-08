<script setup lang="ts">
import { t } from '@psitta/vue'
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const emit = defineEmits<{
  (e: 'tryAgain'): void
}>()

const isNotFound = computed(() => props.error.statusCode === 404)
const isForbidden = computed(() => props.error.statusCode === 403)
</script>

<template>
  <div class="card w-96 bg-gray-800 text-primary-content">
    <div class="card-body items-center text-center">
      <h2 class="card-title text-primary">
        <slot
          name="title"
          :is-not-found="isNotFound"
          :is-forbidden="isForbidden"
        >
          <template v-if="isNotFound">
            {{ t('Not found!') }}
          </template>

          <template v-else-if="isForbidden">
            {{ t('Forbidden!') }}
          </template>

          <template v-else>
            {{ t('Something wrong happened') }}
          </template>
        </slot>
      </h2>

      <p>
        <slot name="body" :is-not-found="isNotFound" />
      </p>

      <div class="card-actions justify-end">
        <slot
          name="action"
          :try-again-fn="() => emit('tryAgain')"
          :is-not-found="isNotFound"
          :is-forbidden="isForbidden"
        >
          <Button
            v-if="!isNotFound"
            class="btn btn-neutral"
            @click="emit('tryAgain')"
          >
            <Icon name="material-symbols:refresh-rounded" />
            {{ t('Try again') }}
          </Button>
        </slot>
      </div>
    </div>
  </div>
</template>
