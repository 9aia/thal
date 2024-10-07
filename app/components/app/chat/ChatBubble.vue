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
  showResend: boolean
}>()

const emit = defineEmits<{
  (e: "resend"): void
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
    <div class="chat-bubble">
      <MDC :value="message" tag="article" class="prose prose-slate prose-sm" />
    </div>

    <div class="chat-footer opacity-90 flex items-center mt-1 gap-1">
      <div class="flex">
        <button
          v-if="(from === 'user') && showResend"
          class="btn btn-sm btn-circle btn-ghost btn-neutral text-teal-500"
          @click="emit('resend')"
        >
          <Icon style="font-size: 1.15rem">
            refresh
          </Icon>
        </button>
      </div>

      <time class="text-xs opacity-90">{{ time }}</time>

      <MessageIcon v-if="right" :status="status" />
    </div>
  </div>
</template>
