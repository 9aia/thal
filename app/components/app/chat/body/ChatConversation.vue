<script setup lang="ts">
import type { Message } from '~/types'

defineProps<{
  history: Message[]
  isError: boolean
  isCharacterDeleted: boolean
}>()

const emit = defineEmits<{
  (e: 'fixScroll'): void
  (e: 'resend'): void
  (e: 'edit', index: number): void
  (e: 'delete', index: number): void
}>()

onMounted(() => {
  emit('fixScroll')
})

const historyQuery = useQuery({
  queryKey: queryKeys.chatHistory(computed(() => route.params.username as string)),
  queryFn: () => $fetch(`/api/chat/history/${route.params.username}`),
})

function handleDelete(messageId: number, shouldInvalidateChat = true) {
  queryClient.setQueryData(
    queryKeys.chat(route.params.username as string),
    (oldData: Message[]) => oldData.filter(message => message.id !== messageId),
  )

  sentErrorChatIds.value.delete(chatId.value)
  sendingChatIds.value.delete(chatId.value)

  if (shouldInvalidateChat) {
    queryClient.invalidateQueries({
      queryKey: queryKeys.chats,
    })
  }
}
</script>

<template>
  <div class="space-y-2">
    <ChatBubble
      v-for="item, index in history"
      :id="item.id"
      :key="item.id"
      :from="item.from"
      :time="item.time"
      :message="item.message"
      :status="item.status"
      :reply-message="item.replyingMessage?.message"
      :replying-id="item.replyingMessage?.id"
      :reply-from="item.replyingMessage?.from"
      :is-character-deleted="isCharacterDeleted"
      :show-delete="index === (history.length - 1) && isError"
      :show-edit="index === (history.length - 1) && isError"
      :show-resend="index === (history.length - 1) && isError"
      img="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
      @resend="emit('resend')"
      @edit="emit('edit', item.id)"
      @delete="emit('delete', item.id)"
    />
  </div>
</template>
