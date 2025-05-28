<script setup lang="ts">
import { t } from '@psitta/vue'

const emit = defineEmits<{
  (e: 'close'): void
}>()

useAutoRedirect({
  query: { drawer: ['account'] },
})
</script>

<template>
  <div class="flex flex-col h-dvh justify-between">
    <Navbar :title="t('Account')" @close="emit('close')" />

    <div class="px-4 py-4 flex-1 overflow-y-auto bg-white space-y-4">
      <AccountSettingsForm />
    </div>
  </div>
</template>
