<script setup lang="ts">
import { useLocale } from "@psitta/vue"
import type { MessageContent, Persona } from "~/types"
import { isRootDrawerOpen } from "~/store"

const props = defineProps<{
  id: number
  persona: Persona
  lastMessage: MessageContent
}>()

const locale = useLocale()

const date = computed(() => {
  const date = props.lastMessage.date

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
  <div role="button" class="px-3 py-1 hover:bg-slate-100 flex gap-2" @click="handleGoToChat(persona.username)">
    <Avatar :name="persona.name" class="w-10 text-sm bg-slate-300 text-slate-800" type="button" />

    <div class="flex-1 flex flex-col justify-center">
      <div class="flex justify-between items-center">
        <a class="block text-base text-slate-800">{{ persona.name }}</a>

        <div class="text-xs text-slate-600">
          {{ date }}
        </div>
      </div>
      <div class="text-sm text-slate-600 flex items-center gap-1">
        <MessageIcon :status="props.lastMessage.status" />
        {{ lastMessage.text }}
      </div>
    </div>
  </div>
</template>
