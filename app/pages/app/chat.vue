<script setup lang="ts">
import type { Chat } from "~/components/chat/ChatConversation.vue"

definePageMeta({
  layout: false,
})

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
  <div class="flex h-screen max-w-[1700px] h-100px w-full mx-auto 2xl:p-6">
    <aside class="hidden sm:w-1/3 bg-white sm:flex flex-col h-full">
      <Navbar />
    </aside>

    <main class="w-full sm:w-2/3 bg-slate-300 flex flex-col h-full">
      <ChatHeader />

      <ChatConversation :chats="chats" />

      <ChatFooter />
    </main>
  </div>
</template>

<style>
body {
  @apply bg-slate-200;
}
</style>
