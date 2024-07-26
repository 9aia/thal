<script setup lang="ts">
import type { Message } from "~/types"

defineProps<{
  chats: Message[]
}>()
</script>

<template>
  <main class="py-4 px-12">
    <ChatBubble
      v-for="chat in chats"
      :key="chat.id"
      :from="chat.from"
      :time="chat.text"
      :message="chat.message"
      :status="chat.status"
      :right="chat.from === 'user'"
      img="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
    />
  </main>
</template>
