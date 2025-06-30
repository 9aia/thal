<script setup lang="ts">
import { t } from '@psitta/vue'

definePageMeta({
  layout: 'settings',
  middleware: 'premium',
})

useAutoRedirect()
</script>

<template>
  <div class="flex flex-col h-dvh justify-between w-full absolute">
    <Navbar
      :title="t('Account')"
      opener="router"
    />

    <div class="pt-2 flex-1 overflow-y-auto bg-white space-y-4">
      <AccountSettingsForm />
    </div>
  </div>
</template>
