<script setup lang="ts">
import { t } from '@psitta/vue'
import { isRootDrawerOpen } from '~/store'
</script>

<template>
  <div class="flex flex-col w-full h-dvh">
    <Navbar class="bg-slate-800 lg:hidden">
      <h1 class="text-lg text-primary font-bold flex items-center gap-1">
        <button class="btn btn-circle btn-ghost text-primary" @click="isRootDrawerOpen = true">
          <Icon name="arrow_back" />
        </button>
        {{ t('Chats') }}
      </h1>
    </Navbar>

    <main class="flex-1 px-4 py-4">
      <div class="flex flex-col h-full items-center justify-center">
        <div class="text-primary rounded-full flex items-center justify-center mb-2">
          <Icon name="waving_hand" class="text-teal-500" style="font-size: 10rem" />
        </div>

        <h1 class="text-5xl text-slate-800 mb-4">
          Thal
        </h1>

        <div class="text-center font-medium text-sm text-slate-600 space-y-1 max-w-lg">
          <p>
            {{ t('Practice English with interactive AI chats.') }}
          </p>

          <p>
            {{ t('Create characters, chat, and enhance your language skills.') }}
          </p>
        </div>
      </div>
    </main>

    <footer class="flex px-4 py-4 gap-2 items-center justify-center">
      <Icon name="science" class="text-green-500 text-xl" />

      <p class="text-slate-600 text-xs">
        {{ t('Thal is for learning and fun. AI chats aren’t professional instruction. Practice responsibly.') }}
      </p>
    </footer>
  </div>
</template>
