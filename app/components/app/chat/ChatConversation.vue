<script setup lang="ts">
import type { Message } from "~/types"

defineProps<{ history: Message[], isError: boolean }>()

const emit = defineEmits<{
  (e: "fixScroll"): void
  (e: "resend"): void
}>()

onMounted(() => {
  emit("fixScroll")
})
</script>

<template>
  <ChatBubble
    v-for="chat, index in history"
    :id="chat.id"
    :key="chat.id"
    :from="chat.from"
    :time="chat.time"
    :message="chat.message"
    :status="chat.status"
    :right="chat.from === 'user'"
    :show-resend="index === (history.length - 1) && isError"
    img="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
    @resend="emit('resend')"
  />
</template>
