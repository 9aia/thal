<script setup lang="ts">
import { t } from '@psitta/vue'

definePageMeta({
  middleware: 'auth',
  layout: 'site',
})
</script>

<template>
  <div class="flex flex-col h-dvh justify-between">
    <h1 class="text-lg text-black flex items-center gap-1 mb-4">
      {{ t("Account Settings") }}
    </h1>

    <div class="flex-1 bg-white space-y-4 w-full flex">
      <div class="w-full flex flex-col">
        <AccountSettingsForm class="w-full" />
      </div>
    </div>
  </div>
</template>
