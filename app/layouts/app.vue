<script setup lang="ts">
import type { Message } from "~/components/chat/ChatConversation.vue"
import { useProfileModal } from "~/composables/useProfileModal"

const { profileModalState } = useProfileModal()

const chats: Message[] = [
  {
    id: "1",
    from: "user",
    message: "Hello, I am Motoko Kusanagi",
    status: "sent",
    text: "10:00 AM",
  },
  {
    id: "1",
    from: "user",
    message: "Hello, I am Motoko Kusanagi",
    status: "sent",
    text: "10:00 AM",
  },
  {
    id: "1",
    from: "bot",
    message: "Hello, I am Motoko Kusanagi",
    status: "sent",
    text: "10:00 AM",
  },
  {
    id: "1",
    from: "bot",
    message: "Hello, I am Motoko Kusanagi",
    status: "sent",
    text: "10:00 AM",
  },
  {
    id: "1",
    from: "bot",
    message: "Hello, I am Motoko Kusanagi",
    status: "sent",
    text: "10:00 AM",
  },
  {
    id: "1",
    from: "bot",
    message: "Hello, I am Motoko Kusanagi",
    status: "sent",
    text: "10:00 AM",
  },
  {
    id: "1",
    from: "bot",
    message: "Hello, I am Motoko Kusanagi",
    status: "sent",
    text: "10:00 AM",
  },
  {
    id: "1",
    from: "bot",
    message: "Hello, I am Motoko Kusanagi",
    status: "sent",
    text: "10:00 AM",
  },
]
</script>

<template>
  <div class="w-full h-dvh mx-auto max-w-[1700px]">
    <div class="drawer lg:drawer-open h-dvh">
      <input id="my-drawer" type="checkbox" class="drawer-toggle">

      <div class="drawer-content flex flex-col h-dvh justify-between">
        <ChatHeader />

        <ChatConversation :chats="chats" class="flex-1 overflow-y-auto" />

        <ChatFooter />
      </div>

      <div class="drawer-side">
        <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay" />

        <div class="flex flex-col h-dvh justify-between bg-slate-300 w-3/4 lg:w-96">
          <slot />
        </div>
      </div>
    </div>

    <ClientOnly>
      <ProfileModal
        v-model="profileModalState.modelValue"
        :username="profileModalState.username"
      />
    </ClientOnly>
  </div>
</template>

<style>
body {
  @apply bg-slate-300;
}
</style>

<style>
* {
  scrollbar-width: thin;
}
</style>
