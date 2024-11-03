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
    v-for="item, index in history"
    :id="item.id"
    :key="item.id"
    :from="item.from"
    :time="item.time"
    :message="item.message"
    :status="item.status"
    :reply-message="item.replyMessage"
    :replying-id="item.replyingId"
    :reply-from="item.replyFrom"
    :show-resend="index === (history.length - 1) && isError"
    img="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
    @resend="emit('resend')"
  />
</template>
