<script setup lang="ts">
import { t } from '@psitta/vue'

definePageMeta({
  middleware: 'auth',
  layout: 'site',
})

useAutoRedirect()
</script>

<template>
  <div class="flex flex-col justify-between">
    <h1 class="text-4xl mb-4 font-bold">
      {{ t("Account Settings") }}
    </h1>

    <div class="flex-1 bg-white space-y-4 w-full flex">
      <div class="w-full flex flex-col h-full pb-8">
        <AccountSettingsForm />
      </div>
    </div>
  </div>
</template>
