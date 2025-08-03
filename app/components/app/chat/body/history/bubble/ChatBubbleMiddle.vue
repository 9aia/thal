<script setup lang="ts">
import { useLocale } from '@psitta/vue'
import type AudibleText from '~/components/app/ai/AudibleText.vue'
import type { MessageAnalysis, MessageAnalysisCompressed } from '~/types'
import type { MessageStatus } from '~~/db/schema'

const props = defineProps<{
  right: boolean
  isEditing: boolean
  messageId: number
  messageContent: string
  messageStatus: MessageStatus
  messageTime: number
  messageAnalysis?: MessageAnalysis
  translation: Translation
}>()
type AudibleTextType = InstanceType<typeof AudibleText>
const audiableTextRef = defineModel<AudibleTextType | null>('audiable-text')

const locale = useLocale()

const time = computed(() => new Intl.DateTimeFormat(locale.value, {
  hour: '2-digit',
  minute: '2-digit',
}).format(new Date(props.messageTime)))

const messageAnalysisCompressed = computed<MessageAnalysisCompressed>(() => {
  return props.messageAnalysis?.[0]?.data.find(item => item.status === 'error')?.data || ''
})
</script>

<template>
  <div
    class="chat-bubble-bg flex flex-col rounded-3xl px-2 py-2 min-w-32 bg-neutral-100 z-20"
    :class="[right ? 'rounded-br-md' : 'rounded-bl-md', !isEditing ? 'max-w-[300px] sm:max-w-[400px] lg:max-w-[500px]' : 'w-full']"
  >
    <div class="px-2">
      <AudibleText
        v-if="!isEditing"
        :id="messageId"
        ref="audiableTextRef"
        :text="messageContent"
      />
      <ChatBubbleEditContent v-else />
    </div>

    <div
      v-if="translation.isOpen.value && translation.translation.value"
      class="px-1 my-1"
    >
      <ChatBubbleTranslation :translation="translation" />
    </div>

    <div
      v-if="messageAnalysis"
      class="px-1 my-1"
    >
      <ChatBubbleAnalysis
        v-if="messageAnalysisCompressed"
        :message-analysis="messageAnalysis"
        :message-analysis-compressed="messageAnalysisCompressed"
      />
    </div>

    <ChatBubbleEditActions v-if="isEditing" />

    <template v-else>
      <div
        class="flex items-center px-2 gap-1"
        :class="{ 'justify-end': right }"
      >
        <time class="text-gray-300 text-xs opacity-90">
          {{ time }}
        </time>
        <MessageIcon
          v-if="right"
          :status="messageStatus"
        />
      </div>
    </template>
  </div>
</template>
