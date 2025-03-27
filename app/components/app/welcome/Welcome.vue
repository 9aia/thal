<script setup lang="ts">
import { t } from '@psitta/vue'
import { isRootDrawerOpen } from '~/store'

const { focusMainField: focusSearch } = useDiscoverFocus()

function goToDiscover() {
  isRootDrawerOpen.value = false
  navigateTo('/app/discover')
  focusSearch({ immediate: true })
}

function openChats() {
  isRootDrawerOpen.value = true
}
</script>

<template>
  <div class="flex flex-col w-full h-dvh bg-white">
    <Navbar class="bg-gray-800 lg:hidden" hide-back hide-title>
      <h1 class="text-lg text-black flex items-center gap-1">
        {{ t('Thal') }}
      </h1>

      <div>
        <Button
          class="btn-ghost"
          size="md"
          shape="circle"
          no-disable-on-loading
          @click="openChats"
        >
          <span class="px-4 py-1 flex items-center justify-center gap-1">
            <Icon name="chat" />
          </span>
        </Button>

        <Button
          class="btn-ghost"
          size="md"
          shape="circle"
          no-disable-on-loading
          @click="goToDiscover"
        >
          <span class="px-4 py-1 flex items-center justify-center gap-1">
            <Icon name="person_search" />
          </span>
        </Button>

        <ChatListOptionsButton />
      </div>
    </Navbar>

    <main class="flex-1 px-4 py-4 w-full sm:w-[500px] lg:w-[600px] sm:mx-auto">
      <div class="flex flex-col h-full items-center justify-center">
        <h1 class="text-6xl text-black mb-2 flex items-center gap-2">
          Thal
        </h1>

        <div class="text-center text-lg text-black space-y-1 max-w-lg">
          <p>
            {{ t('Talk to Learn. Learn to Talk.') }}
          </p>
        </div>

        <Button class="border-gradient-2 rounded-full lg:hidden mt-4" @click="openChats()">
          <span class="px-4 py-1 flex items-center justify-center gap-1">
            <Icon name="chat" />
            {{ t("Open chats") }}
          </span>
        </Button>
      </div>
    </main>

    <footer class="bg-gradient-1 text-blue-500 flex px-4 py-2">
      <div class="sm:max-w-5xl md:max-w-6xl lg:max-w-9xl mx-auto flex gap-2 items-center justify-center">
        <Icon name="science" class="text-xl" />

        <p class="text-xs">
          {{ t('Talk to thals to practice, learn, and have fun. Chats are not professional instruction. Use responsibly.') }}
        </p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.bg-gradient-1 {
  background: radial-gradient(at bottom, theme('colors.blue.50'), theme('colors.gray.50'));
}

.border-gradient-2 {
  @apply border-none px-1 py-1 bg-orange-50 text-orange-500;
  @apply bg-gray-50;
}
</style>
