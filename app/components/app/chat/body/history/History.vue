<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query'
import { useOnline } from '@vueuse/core'
import queryKeys from '~/queryKeys'

const props = defineProps<{
  chatId: number
}>()

const route = useRoute()
const isOnline = useOnline()
const queryClient = useQueryClient()
const username = computed(() => route.params.username as string)
const headers = useRequestHeaders(['cookie'])

const historyQuery = useServerQuery({
  queryKey: queryKeys.chatHistory(username),
  queryFn: () => $fetch(`/api/chat/history/${username.value}` as `/api/chat/history/:username`, {
    headers,
  }),
})

const { isMessagePending } = useMessageSender(username, toRef(() => props.chatId))

const isLastMessageError = computed(() => {
  // TODO: redo this
  return historyQuery.data.value?.length && historyQuery.data.value[historyQuery.data.value.length - 1].status === 'error'
})
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
        <ChatBubble
          v-for="item, index in historyQuery.data.value"
          :id="item.id"
          :key="item.id"

          :status="item.status"
          :content="item.content"
          :time="item.time"
          :from="item.from"

          :in-reply-to="item.inReplyTo ? { ...item.inReplyTo } : undefined"

          :is-character-deleted="false"

          :show-delete="index === (historyQuery.data.value!.length - 1) && isLastMessageError"
          :show-edit="index === (historyQuery.data.value!.length - 1) && isLastMessageError"
          :show-resend="index === (historyQuery.data.value!.length - 1) && isLastMessageError"
        />
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

      <ChatBubbleLoading v-if="isMessagePending && isOnline" />
    </template>
  </CommonResource>
</template>
