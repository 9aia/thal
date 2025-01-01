<script setup lang="ts">
import { useLocale } from '@psitta/vue'
import type { ChatItem } from '~/types'

const props = defineProps<{
  chat?: Readonly<ChatItem>
}>()

const locale = useLocale()

const date = computed(() => {
  const date = props.chat?.lastMessageDatetime ? new Date(props.chat.lastMessageDatetime) : now()

  if (isToday(date)) {
    const formatter = new Intl.DateTimeFormat(locale.value, {
      hour: '2-digit',
      minute: '2-digit',
    })
    return formatter.format(date)
  }

  if (isYesterday(date)) {
    const formatter = new Intl.RelativeTimeFormat(locale.value, {
      numeric: 'auto',
    })
    return formatter.format(-1, 'day')
  }

  if (isThisWeek(date)) {
    const formatter = new Intl.DateTimeFormat(locale.value, {
      weekday: 'long',
    })
    return formatter.format(date)
  }

  const formatter = new Intl.DateTimeFormat(locale.value, {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  })
  return formatter.format(date)
})
</script>

<template>
  <div class="text-xs text-slate-600">
    {{ date }}
  </div>
</template>
