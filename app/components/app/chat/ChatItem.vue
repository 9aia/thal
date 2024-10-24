<script setup lang="ts">
import type { InternalApi } from "nitropack"
import { useLocale } from "@psitta/vue"
import type { MessageStatus } from "~/types"
import { isRootDrawerOpen } from "~/store"

type ChatResponse = InternalApi["/api/chat"]["get"][number]
type LastMessage = InternalApi["/api/chat/lastMessages"]["default"][number]

const props = defineProps<{
  chat: Readonly<ChatResponse>
  lastMessage?: Readonly<LastMessage>
}>()

const locale = useLocale()

const chat = computed(() => {
  return {
    id: props.chat.id,
    persona: {
      name: props.chat.contact?.name || props.chat.personaUsername?.persona?.name || `@${props.chat.personaUsername!.username}`,
      username: props.chat.personaUsername!.username,
      avatar: undefined,
    },
    lastMessage: {
      date: props.lastMessage?.datetime ? new Date(props.lastMessage.datetime) : now(),
      status: "sent" as MessageStatus,
      text: props.lastMessage?.content || "",
    },
  }
})

const date = computed(() => {
  const date = props.lastMessage?.datetime ? new Date(props.lastMessage.datetime) : now()

  if (isToday(date)) {
    const formatter = new Intl.DateTimeFormat(locale.value, {
      hour: "2-digit",
      minute: "2-digit",
    })
    return formatter.format(date)
  }

  if (isYesterday(date)) {
    const formatter = new Intl.RelativeTimeFormat(locale.value, {
      numeric: "auto",
    })
    return formatter.format(-1, "day")
  }

  if (isThisWeek(date)) {
    const formatter = new Intl.DateTimeFormat(locale.value, {
      weekday: "long",
    })
    return formatter.format(date)
  }

  const formatter = new Intl.DateTimeFormat(locale.value, {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  })
  return formatter.format(date)
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

        <div class="text-xs text-slate-600">
          {{ date }}
        </div>
      </div>
      <div
        class="text-sm text-slate-600 flex items-center"
        :title="chat.lastMessage.text"
      >
        <MessageIcon :status="chat.lastMessage.status" />
        <div class="line-clamp-1">
          {{ chat.lastMessage.text }}
        </div>
      </div>
    </div>
  </div>
</template>
