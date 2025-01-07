<script setup lang="ts">
import { t } from '@psitta/vue'

definePageMeta({
  middleware: 'auth',
  layout: 'site',
})
</script>

<template>
  <div class="flex flex-col h-dvh justify-between">
    <Navbar class="bg-transparent">
      <h1 class="text-lg py-2 text-primary font-bold flex items-center gap-1">
        {{ t("Account Settings") }}
      </h1>
    </Navbar>

    <div class="px-3 py-4 flex-1 bg-white space-y-4">
      <div>
        <AccountSettingsForm />
      </div>
    </div>
  </div>
</template>
