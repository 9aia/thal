<script setup lang="ts">
import { t } from '@psitta/vue'
</script>

<template>
  <div class="absolute p-4 w-full sm:p-0 sm:w-auto sm:h-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <div class="card-body max-w-lg flex items-center justify-center flex-col text-center">
      <h1 class="text-2xl">
        {{ t('Your account has been deactivated.') }}
      </h1>

      <div class="">
        {{ t('We are sorry to see you go. If you change your mind, you can always login to recover your account.') }}
      </div>

      <A class="mt-4 w-fit rounded-full px-4 py-2 bg-cyan-500 text-black hover:bg-cyan-600" href="/">
        {{ t('Go to home') }}
      </A>
    </div>
  </div>
</template>
