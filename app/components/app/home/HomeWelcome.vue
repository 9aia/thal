<script setup lang="ts">
import { t } from "@psitta/vue"

const emit = defineEmits<{
  (e: "close"): void
}>()
</script>

<template>
  <div class="flex flex-col w-full h-dvh">
    <header class="lg:hidden px-3 py-2 bg-slate-800 flex gap-2">
      <div class="text-primary flex items-center gap-2">
        <Btn size="sm" class="btn-ghost btn-circle" @click="emit('close')">
          <Icon name="arrow_back" />
        </Btn>
        {{ t("Chats") }}
      </div>
    </header>

    <main class="flex-1 px-4 py-4">
      <div class="flex flex-col h-full items-center justify-center">
        <div class="text-primary bg-white rounded-full p-8 flex items-center justify-center mb-2">
          <Icon name="chat" style="font-size: 5rem" />
        </div>

        <h1 class="text-5xl font-medium text-slate-800 mb-4">
          Thal
        </h1>

        <div class="text-center font-medium">
          <p class="text-sm text-slate-800 mb-2 max-w-lg">
            {{ t('Practice your English skills through interactive chats powered by AI.') }}
          </p>

          <p class="text-sm text-slate-800 max-w-lg">
            {{ t('Create unique personas, chat with them, and improve your language proficiency in a engaging way.') }}
          </p>
        </div>
      </div>
    </main>

    <footer class="flex px-4 py-4 gap-2 items-center justify-center">
      <Icon name="science" class="text-slate-800" />

      <p class="text-slate-800 text-sm">
        {{ t('This app is intended for educational and entertainment purposes only. The content and interactions within the app do not constitute professional language instruction. Users are encouraged to verify information independently and use the app responsibly.') }}
      </p>
    </footer>
  </div>
</template>
