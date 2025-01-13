<script setup lang="ts">
import { useLocale } from '@psitta/vue'
import type { UseMutationReturnType } from '@tanstack/vue-query'
import MessageIcon from './MessageIcon.vue'
import type { MessageStatus } from '~/types'
import { contentEditableRef, replies } from '~/store'

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
  (e: 'listen'): void
  (e: 'translate'): void
}>()

const right = computed(() => props.from === 'user')

const locale = useLocale()
const route = useRoute()

const username = computed(() => route.params.username as string)

const time = computed(() => new Intl.DateTimeFormat(locale.value, {
  hour: '2-digit',
  minute: '2-digit',
}).format(new Date(props.time)))

const translation = useTranslation({
  chatUsername: username.value,
  message: toRef(props, 'message'),
  replyMessageId: computed(() => props.replyingId ? props.replyingId : undefined),
  refetchOnTranslate: false,
})

function setReply() {
  replies[username.value] = {
    message: props.message,
    from: props.from,
    id: props.id,
  }

  contentEditableRef.value?.focus()
}

const audiableTextRef = ref()

const audiableTextMutation = computed(() => {
  if (!audiableTextRef.value) {
    return null
  }

  return audiableTextRef.value.playMutation as UseMutationReturnType<unknown, Error, void, unknown>
})
</script>

<template>
  <div
    :id="`bubble-container-${id}`" class="chat group bubble-scrollable" :class="{
      'chat-start': !right,
      'chat-end': right,
    }"
  >
    <div v-if="!!replyMessage" class="px-1 mb-1 translate-y-[1rem]">
      <ChatReply
        :reply-message="replyMessage" :replying-id="replyingId!" :username="username"
        :reply-from="replyFrom!"
      />
    </div>

    <div class="chat-bubble flex items-center gap-2 bg-transparent p-0">
      <ChatAside v-if="right" :right="!!right" :translation="translation" @set-reply="setReply" />

      <div
        class="chat-bubble-bg bg-gray-50 flex flex-col rounded-3xl px-2 py-2 min-w-32 max-w-[300px] sm:max-w-[400px] lg:max-w-[500px]"
        :class="[right ? 'rounded-br-md' : 'rounded-bl-md']"
      >
        <div class="px-2">
          <AudibleText ref="audiableTextRef" :text="message" />
        </div>

        <div v-if="translation.isOpen.value" class="px-1 my-1">
          <ChatBubbleTranslation :translation="translation" />
        </div>

        <div class="flex items-center px-2 gap-1" :class="{ 'justify-end': right }">
          <time class="text-gray-300 text-xs opacity-90">{{ time }}</time>
          <MessageIcon v-if="right" :status="status" />
        </div>
      </div>

      <ChatAside v-if="!right" :right="!!right" :translation="translation" @set-reply="setReply" />
    </div>

    <div class="chat-footer opacity-90 flex items-center mt-1 gap-1" :class="{ 'flex-row-reverse': !right }">
      <div class="flex gap-1 items-center min-h-8" :class="{ 'flex-row-reverse': !right }">
        <Button
          v-if="(from === 'user') && showResend"
          class="btn btn-sm btn-circle btn-ghost btn-gray text-magenta-500 hidden group-hover:block" shape="circle"
          @click="emit('resend')"
        >
          <Icon class="text-base">
            refresh
          </Icon>
        </Button>

        <Button
          class="text-gray-800 btn-ghost hidden group-hover:block" shape="circle" no-disable-on-loading
          :loading="audiableTextMutation?.isPending.value" @click="audiableTextMutation?.mutate()"
        >
          <Icon class="text-base">
            volume_up
          </Icon>
        </Button>

        <Button
          class="text-gray-800 btn-ghost hidden group-hover:block" shape="circle"
          :loading="translation.isLoading.value" @click="translation.onTranslate()"
        >
          <Icon class="text-base">
            translate
          </Icon>
        </Button>
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
.bubble-scrollable {
  scroll-margin: 2rem;
}

.animate-highlight {
  animation: highlight 1s ease-in-out;
}

@keyframes highlight {

  0%,
  100% {
    @apply bg-white;
  }

  50% {
    @apply bg-yellow-500;
  }
}
</style>
