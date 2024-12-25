<script setup lang="ts">
import type { InternalApi } from "nitropack"
import { isRootDrawerOpen } from "~/store"
import type { MessageStatus } from "~/types"

type ChatResponse = InternalApi["/api/chat"]["get"][number]
type LastMessage = InternalApi["/api/chat/lastMessages"]["default"][number]

const props = defineProps<{
  chat: Readonly<ChatResponse>
  lastMessage?: Readonly<LastMessage>
}>()

const chat = computed(() => {
  return {
    id: props.chat.id,
    persona: {
      name: props.chat.contact?.name || props.chat?.personaUsername?.persona?.name || `@${props.chat.personaUsername!.username}`,
      username: props.chat.personaUsername!.username,
      avatar: undefined,
    },
    lastMessage: props.lastMessage
      ? {
          date: new Date(props.lastMessage.datetime),
          status: "sent" as MessageStatus,
          text: props.lastMessage.content || "",
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
          <ChatItemTime :last-message="props.lastMessage" :date="chat.lastMessage.date" />
        </Clientonly>
      </div>

      <div
        class="text-sm text-slate-600 flex items-center"
      >
        <MessageIcon
          v-if="chat.lastMessage"
          :status="chat.lastMessage.status"
        />

        <div class="line-clamp-1" :class="{ invisible: !chat.lastMessage }">
          {{ chat.lastMessage?.text || '-' }}
        </div>
      </div>
    </div>
  </div>
</template>
