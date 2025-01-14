<script setup lang="ts">
import { t } from '@psitta/vue'
import { isRootDrawerOpen } from '~/store'
</script>

<template>
  <div class="flex flex-col w-full h-dvh bg-white p-4">
    <Navbar class="bg-gray-800 lg:hidden">
      <h1 class="text-lg text-primary flex items-center gap-1">
        {{ t('Thal') }}
      </h1>
    </Navbar>

    <main class="flex-1 px-4 py-4 w-screen sm:w-[500px] lg:w-[600px] sm:mx-auto">
      <div class="flex flex-col h-full items-center justify-center">
        <h1 class="text-6xl text-black mb-2 flex items-center gap-2">
          Thal
        </h1>

        <div class="text-center text-lg text-black space-y-1 max-w-lg">
          <p>
            {{ t('Talk to Learn. Learn to Talk.') }}
          </p>
        </div>

        <Button class="lg:hidden btn-outline btn-primary mt-4" @click="isRootDrawerOpen = true">
          <Icon name="chat" />
          {{ t('Chats') }}
        </Button>
      </div>
    </main>

    <footer class="bg-gradient-1 text-blue-500 rounded-lg flex px-4 py-2 sm:max-w-5xl md:max-w-6xl lg:max-w-9xl mx-auto gap-2 items-center justify-center">
      <Icon name="science" class="text-xl" />

      <p class="text-xs">
        {{ t('Thal is for learning, practice and fun. AI chats aren’t professional instruction. Use responsibly.') }}
      </p>
    </footer>
  </div>
</template>

<style scoped>
.bg-gradient-1 {
  background: radial-gradient(at bottom, theme('colors.blue.50'), theme('colors.gray.50'));
}
</style>
