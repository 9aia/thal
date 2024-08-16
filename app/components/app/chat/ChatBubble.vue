<script setup lang="ts">
import { useLocale } from "@psitta/vue"

const props = defineProps<{
  right?: boolean
  from: string
  time: number
  message: string
  status: string
  img: string
}>()

const locale = useLocale()

const time = computed(() => new Intl.DateTimeFormat(locale.value, {
  hour: "2-digit",
  minute: "2-digit",
}).format(new Date(props.time)))
</script>

<template>
  <div
    class="chat"
    :class="{
      'chat-start': !right,
      'chat-end': right,
    }"
  >
    <div class="chat-header">
      <time class="text-xs opacity-50">{{ time }}</time>
    </div>

    <div class="chat-bubble" v-html="message" />

    <div class="chat-footer opacity-50">
      {{ status }}
    </div>
  </div>
</template>
