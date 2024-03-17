<script setup lang="ts">
import { t } from '~/lib/psitta/vue';
</script>

<template>
  <div class="absolute p-4 w-full sm:p-0 sm:w-auto sm:h-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <div class="card sm:w-96 bg-slate-900 text-white shadow-lg">
      <div class="card-body">
        <h1 class="card-title text-teal-500">
          {{ t('Your account has been deleted.') }}
        </h1>

        <div class="mt-4">
          {{ t('We are sorry to see you go.') }}
        </div>

        <div class="mt-4">
          {{ t('If you change your mind, you can always create a new account.') }}
        </div>

        <A
          class="mt-6 btn btn-primary"
          href="/"
        >
          {{ t('Go to home') }}
        </A>
      </div>
    </div>
  </div>
</template>
