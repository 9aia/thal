<script setup lang="ts">
import { t } from '@psitta/vue'

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <div class="flex flex-col h-dvh justify-between">
    <Navbar>
      <h1 class="text-lg py-2 text-primary font-bold flex items-center gap-1">
        <Button size="sm" class="btn-ghost btn-circle" @click="emit('close')">
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
