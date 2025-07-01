<script setup lang="ts">
import type AudibleText from '~/components/app/ai/AudibleText.vue'
import { edition } from '~/store'
import type { InReplyTo, MessageStatus } from '~~/db/schema'

const props = defineProps<{
  id: number
  content: string
  time: number
  status: MessageStatus
  from: 'user' | 'bot'
  inReplyTo?: InReplyTo

  isLast: boolean
}>()

const right = computed(() => props.from === 'user')

const route = useRoute()

const isEditing = computed(() => edition.messageId === props.id)
const username = computed(() => route.params.username as string)

const translation = useTranslation({
  queryKey: 'chat-bubble-translation',
  chatUsername: username.value,
  message: computed(() => isEditing.value ? edition.content! : props.content),
  replyMessageId: computed(() => props.inReplyTo?.id ? props.inReplyTo.id : undefined),
  refetchOnTranslate: false,
  messageIsBot: computed(() => props.from === 'bot'),
})

type AudibleTextType = InstanceType<typeof AudibleText>
const audiableTextRef = ref<AudibleTextType | null>(null)
</script>

<template>
  <div
    :id="`bubble-container-${id}`"
    class="w-full group scroll-m-4"
    :class="{
      'chat-start': !right,
      'chat-end': right,
    }"
  >
    <div v-if="inReplyTo" class="px-1 mb-1 translate-y-[1rem]">
      <ChatInReplyTo
        :is="inReplyTo"
        :username="username"
      />
    </div>

    <div class="flex items-center gap-2 bg-transparent p-0" :class="[isEditing ? 'w-full' : '', right ? 'flex-row' : 'flex-row-reverse']">
      <ChatBubbleAside
        v-if="!isEditing"
        :right="!!right"
        :message-id="id"
        :message-from="from"
        :message-status="status"
        :message-content="content"
        :is-last="isLast"
      />

      <ChatBubbleMiddle
        v-model:audiable-text="audiableTextRef"
        :message-id="id"
        :message-time="time"
        :message-status="status"
        :message-content="content"
        :right="right"
        :is-editing="isEditing"
        :translation="translation"
      />
    </div>

    <ChatBubbleFooter
      v-model:audiable-text="audiableTextRef"
      :message-id="id"
      :message-content="content"
      :message-from="from"
      :message-status="status"
      :translation="translation"
      :is-editing="isEditing"
      :is-last="isLast"
      :right="right"
    />
  </div>
</template>
