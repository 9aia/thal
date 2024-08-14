<script setup lang="ts">
import type { Message } from "~/types"

defineProps<{ history: Message[] }>()

const emit = defineEmits<{
  (e: "fixScroll"): void
}>()

onMounted(() => {
  emit("fixScroll")
})
</script>

<template>
  <ChatBubble
    v-for="chat in history"
    :key="chat.id"
    :from="chat.from"
    :time="chat.text"
    :message="chat.message"
    :status="chat.status"
    :right="chat.from === 'user'"
    img="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
  />
</template>
