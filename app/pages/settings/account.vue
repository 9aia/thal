<script setup lang="ts">
import { t } from '@psitta/vue'

definePageMeta({
  middleware: 'auth',
  layout: 'site',
})

useAutoRedirect()
</script>

<template>
  <div class="flex flex-col justify-between site-container">
    <h1 class="text-4xl mb-4">
      {{ t("Account Settings") }}
    </h1>

    <div class="pt-2 flex-1 overflow-y-auto bg-white space-y-4 -mx-6">
      <AccountSettingsForm />
    </div>
  </div>
</template>
