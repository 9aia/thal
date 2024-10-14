<script setup lang="ts">
import { useLocale } from "@psitta/vue"
import MessageIcon from "./MessageIcon.vue"
import type { MessageStatus } from "~/types"
import { replies } from "~/store"

const props = defineProps<{
  id: number
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

const translation = useTranslation(toRef(props, "message"))

const route = useRoute()

const username = computed(() => route.params.username as string)

function setReply() {
  replies[username.value] = {
    message: props.message,
    from: props.right ? "me" : "bot",
    id: props.id,
  }
}
</script>

<template>
  <div
    class="chat group" :class="{
      'chat-start': !right,
      'chat-end': right,
    }"
  >
    <div class="chat-bubble flex items-center gap-2 bg-transparent p-0">
      <ChatAside
        v-if="right"
        :right="!!right"
        :translation="translation"
        @set-reply="setReply"
      />

      <div class="chat-bubble max-w-[300px] sm:max-w-[400px] lg:max-w-[500px]">
        <MDC :value="message" tag="article" class="prose prose-slate prose-sm" />

        <ChatBubbleTranslation :translation="translation" />
      </div>

      <ChatAside
        v-if="!right"
        :right="!!right"
        :translation="translation"
        @set-reply="setReply"
      />
    </div>

    <div class="chat-footer opacity-90 flex items-center mt-1 gap-1">
      <div class="flex">
        <button
          v-if="(from === 'user') && showResend" class="btn btn-sm btn-circle btn-ghost btn-neutral text-teal-500"
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
