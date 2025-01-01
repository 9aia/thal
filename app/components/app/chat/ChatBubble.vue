<script setup lang="ts">
import { useLocale } from '@psitta/vue'
import MessageIcon from './MessageIcon.vue'
import type { MessageStatus } from '~/types'
import { replies } from '~/store'

const props = defineProps<{
  id: number
  from: 'user' | 'bot'
  time: number
  message: string
  replyMessage?: string
  replyingId?: number | null
  replyFrom?: 'user' | 'bot'
  status: MessageStatus
  img: string
  showResend: boolean
}>()
const emit = defineEmits<{
  (e: 'resend'): void
}>()

const right = computed(() => props.from === 'user')

const locale = useLocale()
const route = useRoute()

const time = computed(() => new Intl.DateTimeFormat(locale.value, {
  hour: '2-digit',
  minute: '2-digit',
}).format(new Date(props.time)))

const translation = useTranslation(toRef(props, 'message'))

const username = computed(() => route.params.username as string)

function setReply() {
  replies[username.value] = {
    message: props.message,
    from: props.from,
    id: props.id,
  }
}
</script>

<template>
  <div
    :id="`bubble-container-${id}`" class="chat group bubble-scrollable"
    :class="{
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

      <div
        class="chat-bubble max-w-[300px] sm:max-w-[400px] lg:max-w-[500px] bubble"
        :class="replyMessage ? 'px-0 py-1' : 'px-1'"
      >
        <div v-if="!!replyMessage" class="px-1 mb-1">
          <ChatReply
            :reply-message="replyMessage"
            :replying-id="replyingId!"
            :username="username"
            :reply-from="replyFrom!"
          />
        </div>

        <div class="px-2 mb-1">
          <MDC :value="message" tag="article" class="prose prose-slate prose-sm" />
        </div>

        <div
          v-if="translation.translation.value && translation.isOpen.value"
          class="px-1"
        >
          <ChatBubbleTranslation :translation="translation" />
        </div>
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

<style scoped lang="postcss">
.bubble-scrollable {
  scroll-margin: 2rem;
}

.animate-highlight {
  animation: highlight 1s ease-in-out;
}

@keyframes highlight {
  0%, 100% {
    @apply bg-white;
  }
  50% {
    @apply bg-teal-100;
  }
}
</style>
