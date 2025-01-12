<script setup lang="ts">
import { t } from '@psitta/vue'

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <div class="flex flex-col h-dvh justify-between">
    <Navbar>
      <h1 class="text-lg py-2 text-gradient-1 flex items-center gap-1">
        <Button size="sm" class="btn-ghost" shape="circle" @click="emit('close')">
          <Icon name="arrow_back" />
        </Button>
        {{ t("Account") }}
      </h1>
    </Navbar>

    <div class="px-4 py-4 flex-1 overflow-y-auto bg-white space-y-4">
      <AccountSettingsForm />
    </div>
  </div>
</template>

<style scoped>
.text-gradient-1 {
  background: radial-gradient(theme('colors.blue.500'), theme('colors.cyan.500')) !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
  color: transparent !important;
}
</style>
