<script setup lang="ts">
import type { Chat } from "~/components/chat/ChatConversation.vue"

definePageMeta({
  layout: "app",
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
  <div>
    Chats
  </div>
</template>

<style>
body {
  @apply bg-slate-200;
}
</style>
