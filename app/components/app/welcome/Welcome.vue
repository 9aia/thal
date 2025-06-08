<script setup lang="ts">
import { t } from '@psitta/vue'
import { isRootDrawerOpen } from '~/store'

async function goToDiscover() {
  isRootDrawerOpen.value = false
  await navigateTo('/app/discover')
}

function openChats() {
  isRootDrawerOpen.value = true
}
</script>

<template>
  <div class="flex flex-col w-full h-dvh bg-white">
    <Navbar class="bg-gray-800 lg:hidden" hide-back="on-lg" hide-title>
      <h1 class="text-lg text-black flex items-center gap-1">
        {{ t('Thal') }}
      </h1>

      <div class="flex gap-1">
        <Button
          class="btn btn-ghost btn-circle"
          shape="circle"
          no-disable-on-loading
          @click="openChats"
        >
          <span class="px-4 py-1 flex items-center justify-center gap-1">
            <Icon name="material-symbols:chat-outline" />
          </span>
        </Button>

        <Button
          class="btn btn-ghost btn-circle"
          shape="circle"
          no-disable-on-loading
          @click="goToDiscover"
        >
          <span class="px-4 py-1 flex items-center justify-center gap-1">
            <Icon name="material-symbols:person-search-outline" />
          </span>
        </Button>

        <ChatListOptionsButton />
      </div>
    </Navbar>

    <main class="flex-1 px-4 py-4 w-full sm:w-[500px] lg:w-[600px] sm:mx-auto">
      <div class="flex flex-col h-full items-center justify-center">
        <Icon
          name="material-symbols:chat-outline-rounded"
          class="text-9xl text-black mb-2 flex items-center gap-2"
        />

        <h1 class="text-6xl text-black mb-2 flex items-center gap-2">
          Thal
        </h1>

        <div class="text-center text-lg text-black max-w-lg">
          <p class="text-gray-500 text-sm">
            {{ t('Talk to thals to practice, learn, and have fun.') }}
          </p>
        </div>

        <Button class="btn btn-soft btn-primary lg:hidden mt-4" @click="openChats()">
          <Icon name="material-symbols:chat-outline" />
          {{ t("Open chats") }}
        </Button>
      </div>
    </main>

    <footer class="bg-radial-[at_bottom] from-blue-50 to-gray-50 flex px-4 py-2">
      <div class="sm:max-w-5xl md:max-w-6xl lg:max-w-9xl mx-auto flex gap-2 items-center justify-center">
        <Icon name="material-symbols:science-outline" class="text-xl" />

        <p class="text-xs">
          {{ t('AI may be inaccurate. Verify important responses.') }}
        </p>
      </div>
    </footer>
  </div>
</template>
