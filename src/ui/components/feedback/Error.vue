<script setup lang="ts">
import type { NuxtError } from '#app';
import { t } from '@psitta/vue';

const props = defineProps<{
  error: NuxtError
}>()

const emit = defineEmits<{
  (e: 'tryAgain'): void
}>()

const isNotFound = computed(() => props.error.statusCode === 404)
</script>

<template>
  <div class="card w-96 bg-slate-800 text-primary-content">
    <div class="card-body items-center text-center">
      <h2 class="card-title text-teal-500">
        <slot name="title" :is-not-found="isNotFound">
          <template v-if="isNotFound">
            {{ t('Not found!') }}
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
        <Btn
          v-if="!isNotFound"
          @click="emit('tryAgain')"
          class="btn-primary"
        >
          <Icon name="mdi-refresh" />
          {{ t('Try again') }}
        </Btn>
      </div>
    </div>
  </div>
</template>
