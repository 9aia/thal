<script setup lang="ts">
defineProps<{
  chats: Message[]
}>()
</script>

<script lang="ts">
export interface Message {
  id: string
  from: "user" | "bot"
  message: string
  text: string
  status: string
}
</script>

<template>
  <main class="pt-4 px-12 flex flex-col h-full">
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
