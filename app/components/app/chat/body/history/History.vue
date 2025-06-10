<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query'
import queryKeys from '~/queryKeys'

const route = useRoute()
const queryClient = useQueryClient()
const username = computed(() => route.params.username as string)
const headers = useRequestHeaders(['cookie'])

const historyQuery = useServerQuery({
  queryKey: queryKeys.chatHistory(username),
  queryFn: () => $fetch(`/api/chat/history/${username.value}` as `/api/chat/history/:username`, {
    headers,
  }),
})

// function updateHistory(newMessage: SendMessageData) {
//   const newHistory = [...data.value.history || []]

//   newHistory.push({
//     id: newHistory.length + 1,
//     from: 'user',
//     status: isOnline.value ? 'seen' : 'sending',
//     message: newMessage.value,
//     replyingMessage: newMessage?.replyingId
//       ? {
//           id: newMessage!.replyingId!,
//           message: newMessage!.replyMessage!,
//           from: newMessage!.replyFrom!,
//         }
//       : null,
//     time: new Date().getTime(),
//   })

//   queryClient.setQueryData(queryKeys.chat(route.params.username as string), {
//     ...data.value,
//     history: newHistory,
//   })
// }
</script>

<template>
  <CommonResource
    :for="historyQuery"
  >
    <template #empty>
      <span />
    </template>

    <template #default>
      <div class="space-y-2">
        {{ JSON.stringify(historyQuery.data.value) }}

        <!-- <ChatBubble
          v-for="item, index in historyQuery.data.value"
          :id="item.id"
          :key="item.id"

          :status="item.status"
          :message="item.message"
          :time="item.time"
          :from="item.from"

          :is-character-deleted="false"

          :reply-message="item.replyingMessage?.message"
          :replying-id="item.replyingMessage?.id"
          :reply-from="item.replyingMessage?.from"

          :show-delete="index === (historyQuery.data.value!.length - 1) && isLastMessageError"
          :show-edit="index === (historyQuery.data.value!.length - 1) && isLastMessageError"
          :show-resend="index === (historyQuery.data.value!.length - 1) && isLastMessageError"
        /> -->
      <!-- TODO: redo this -->
      <!--
        :is-character-deleted="isCharacterDeleted"
        @resend="emit('resend')"
        @edit="emit('edit', item.id)"
        @delete="emit('delete', item.id)" -->
      </div>
      <!-- TODO: remove this -->
      <!-- <ChatConversation
          :is-error="messageError"
          :is-character-deleted="data.isCharacterDeleted"
          @fix-scroll="goToBottom"
          @resend="handleResend()"
          @delete="handleDelete($event)"
          @edit="handleEdit()"
        />
      -->

      <!-- <ChatBubbleLoading v-if="isMessagePending && isOnline" /> -->
    </template>
  </CommonResource>
</template>
