<script setup lang="ts">
import { useLocale } from '@psitta/vue'

const props = defineProps<{
  datetime: number
}>()

const locale = useLocale()

const date = computed(() => {
  const date = props.datetime ? new Date(props.datetime) : now()

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
  <div class="text-xs text-gray-600">
    {{ date }}
  </div>
</template>
