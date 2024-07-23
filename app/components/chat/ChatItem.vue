<script setup lang="ts">
import { useLocale } from "@psitta/vue"
import type { MessageContent, User } from "~/types"

const props = defineProps<{
  id: string
  user: User
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

const icon = computed(() => {
  let icon: string

  switch (props.lastMessage.status) {
    case "sending":
      icon = "schedule"
      break
    case "seen":
      icon = "done_all"
      break
    case "received":
      icon = "done_all"
      break
    case "sent":
      icon = "check"
      break
  }

  return icon
})
</script>

<template>
  <div role="button" class="px-3 py-1 hover:bg-slate-100 flex gap-2">
    <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
      <div class="w-10 rounded-full">
        <img
          alt="Tailwind CSS Navbar component"
          src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"
        >
      </div>
    </div>

    <div class="flex-1 flex flex-col justify-center">
      <div class="flex justify-between items-center">
        <a class="block text-base text-slate-800">{{ user.name }}</a>

        <div class="text-xs text-slate-600">
          {{ date }}
        </div>
      </div>
      <div class="text-sm text-slate-600 flex items-center gap-1">
        <Icon :name="icon" :class="[lastMessage.status === 'seen' ? 'text-sky-500' : 'text-slate-500']" style="font-size: 1.15rem" />
        {{ lastMessage.text }}
      </div>
    </div>
  </div>
</template>
