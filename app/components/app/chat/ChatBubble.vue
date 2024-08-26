<script setup lang="ts">
import { useLocale } from "@psitta/vue"
import MessageIcon from "./MessageIcon.vue"
import type { MessageStatus } from "~/types"

const props = defineProps<{
  right?: boolean
  from: string
  time: number
  message: string
  status: MessageStatus
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
    <div class="chat-bubble" v-html="message" />

    <div class="chat-footer opacity-90 flex items-center mt-1 gap-1">
      <time class="text-xs opacity-90">{{ time }}</time>

      <MessageIcon v-if="right" :status="status" />
    </div>
  </div>
</template>
