<script setup lang="ts">
import type { InternalApi } from "nitropack"
import { t } from "@psitta/vue"
import { isRootDrawerOpen } from "~/store"
import type { ChatItem } from "~/types"

const props = defineProps<{
  chat: Readonly<ChatItem>
}>()

const chat = computed(() => {
  return {
    id: props.chat.chat_id,
    persona: {
      name: props.chat.contact_name || props.chat?.persona_name || `@${props.chat.persona_username}`,
      username: props.chat.persona_username,
      avatar: undefined,
    },
    lastMessage: props.chat.last_message_content
      ? {
          date: new Date(props.chat.last_message_datetime),
          status: props.chat.lastMessageStatus,
          text: props.chat.last_message_content || "",
        }
      : undefined,
  }
})

function handleGoToChat(username: string) {
  isRootDrawerOpen.value = false

  navigateTo(`/app/chat/${username}`)
}
</script>

<template>
  <div role="button" class="px-3 py-1 hover:bg-slate-100 flex gap-2" @click="handleGoToChat(chat.persona.username)">
    <Avatar :name="chat.persona.name" class="w-10 text-sm bg-slate-300 text-slate-800" type="button" />

    <div class="flex-1 flex flex-col justify-center w-10px">
      <div class="flex justify-between items-center">
        <a class="block text-base text-slate-800">{{ chat.persona.name }}</a>

        <ClientOnly v-if="chat.lastMessage">
          <ChatItemTime :chat="props.chat" :date="chat.lastMessage.date" />
        </Clientonly>
      </div>

      <div
        class="text-sm text-slate-600 flex items-center gap-0.5"
      >
        <div v-if="chat.lastMessage?.status === 'seen'" class="line-clamp-1 text-green-500" :class="{ invisible: !chat.lastMessage }">
          {{ t('Typing...') }}
        </div>

        <template v-else>
          <MessageIcon
            v-if="chat.lastMessage && chat.lastMessage.status"
            :status="chat.lastMessage.status"
          />

          <div class="line-clamp-1" :class="{ invisible: !chat.lastMessage }">
            {{ chat.lastMessage?.text || '-' }}
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
