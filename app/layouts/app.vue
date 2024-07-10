<script setup lang="ts">
import type { Chat } from "~/components/chat/ChatConversation.vue"

const { profileModalState } = useProfileModal()

const chats: Chat[] = [
  {
    id: "1",
    from: "user",
    message: "Hello, I am Motoko Kusanagi",
    status: "sent",
    time: "10:00 AM",
  },
  {
    id: "1",
    from: "user",
    message: "Hello, I am Motoko Kusanagi",
    status: "sent",
    time: "10:00 AM",
  },
  {
    id: "1",
    from: "bot",
    message: "Hello, I am Motoko Kusanagi",
    status: "sent",
    time: "10:00 AM",
  },
]
</script>

<template>
  <div class="w-full h-dvh mx-auto max-w-[1700px] overflow-hidden">
    <div class="drawer lg:drawer-open h-dvh 2xl:p-6">
      <input id="my-drawer" type="checkbox" class="drawer-toggle">
      <div class="drawer-content h-full">
        <div class="flex flex-col h-full bg-slate-200">
          <ChatHeader />

          <ChatConversation :chats="chats" />

          <ChatFooter />
        </div>
      </div>

      <div class="drawer-side h-full !overflow-y-hidden">
        <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay" />

        <div class="bg-slate-200 h-full flex flex-col w-96">
          <Navbar>
            <slot />
          </Navbar>
        </div>
      </div>
    </div>

    <ClientOnly>
      <ProfileModal
        v-model="profileModalState.modelValue"
        username="viniemidiobosi9473"
      />
    </ClientOnly>
  </div>
</template>

<style>
body {
  @apply bg-slate-300;
}
</style>
