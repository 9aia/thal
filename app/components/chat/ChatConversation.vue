<script setup lang="ts">
defineProps<{
  chats: Chat[]
}>()
</script>

<script lang="ts">
export interface Chat {
  id: string
  from: "user" | "bot"
  message: string
  time: string
  status: string
}
</script>

<template>
  <main class="pt-4 px-12 flex flex-col h-full">
    <ChatBubble
      v-for="chat in chats"
      :key="chat.id"
      :from="chat.from"
      :time="chat.time"
      :message="chat.message"
      :status="chat.status"
      :right="chat.from === 'user'"
      img="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
    />
  </main>
</template>
