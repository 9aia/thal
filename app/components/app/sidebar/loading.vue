<script setup lang="ts">
import { t } from '@psitta/vue'
</script>

<template>
  <div class="bg-white flex flex-col h-dvh justify-between w-full">
    <Navbar hide-title hide-back="always">
      <div class="flex gap-2 items-center">
        <h1>
          <button
            class="flex items-center gap-2 justify-center text-lg font-medium text-black cursor-pointer border-b-2 border-b-transparent focus:border-b-primary focus:outline-hidden"
            @click="navigateTo('/app/')"
          >
            {{ t('Thal') }}
            <ExperimentalBadge />
          </button>
        </h1>
      </div>
    </Navbar>

    <div class="pt-2 flex-1 space-y-4 overflow-y-auto">
      <ChatListPastDueAppNote />
    </div>
  </div>
</template>
