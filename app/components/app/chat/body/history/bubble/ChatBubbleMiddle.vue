<script setup lang="ts">
import { useLocale } from '@psitta/vue'
import type AudibleText from '~/components/app/ai/AudibleText.vue'
import type { MessageStatus } from '~~/db/schema'
import type { MessageCorrectionData } from '~/types'

const props = defineProps<{
  right: boolean
  isEditing: boolean
  messageId: number
  messageContent: string
  messageStatus: MessageStatus
  messageTime: number
  translation: Translation
  messageCorrection?: MessageCorrectionData
}>()
type AudibleTextType = InstanceType<typeof AudibleText>
const audiableTextRef = defineModel<AudibleTextType | null>('audiable-text')

const locale = useLocale()

const time = computed(() => new Intl.DateTimeFormat(locale.value, {
  hour: '2-digit',
  minute: '2-digit',
}).format(new Date(props.messageTime)))

const showDiff = computed(() => {
  if (!props.right)
    return false
  const mc = props.messageCorrection
  if (!mc)
    return false
  const hasError = mc.status === 'needs_correction'
  // const isNonMinor = mc.severity && mc.severity !== 'minor'
  const hasCorrected = !!mc.correctedMessage
  return hasError && hasCorrected
})

const isMessageAnalysisModalOpen = ref(false)
const messageAnalysisModalPart = ref<string | null>(null)

function openMessageAnalysisModal(part?: string) {
  // TODO: open the message analysis modal with focus on the text part
  messageAnalysisModalPart.value = part || null
  isMessageAnalysisModalOpen.value = true
}

const hasErrorsAndNotIgnored = computed(() => {
  return showDiff.value && !props.messageCorrection!.ignoredAt
})
</script>

<template>
  <div
    class="chat-bubble-bg flex flex-col rounded-3xl px-2 py-2 min-w-32 bg-neutral-100 z-20"
    :class="[
      right ? 'rounded-br-md' : 'rounded-bl-md',
      !isEditing ? 'max-w-[300px] sm:max-w-[400px] lg:max-w-[500px]' : 'w-full',
      hasErrorsAndNotIgnored ? 'cursor-pointer' : '',
    ]"
    @click="hasErrorsAndNotIgnored && openMessageAnalysisModal()"
  >
    <div
      class="px-2"
    >
      <div v-if="!isEditing" class="relative">
        <AudibleText
          :id="messageId"
          ref="audiableTextRef"
          :text="messageContent"
          :message-correction="messageCorrection"
          :corrected-text="messageCorrection!.correctedMessage!"
        />

        <div
          v-if="hasErrorsAndNotIgnored"
          class="absolute inset-0 -z-1 select-none"
        >
          <CorrectedMessage
            :original-text="messageContent"
            :corrected-text="messageCorrection!.correctedMessage!"
            :message-id="messageId"
            :message-correction="messageCorrection"
          />
        </div>

        <LazyMessageAnalysisModal
          v-if="isMessageAnalysisModalOpen"
          v-model="isMessageAnalysisModalOpen"
          :message="messageContent"
          :message-id="messageId"
          :message-correction="messageCorrection"
        />
      </div>
      <ChatBubbleEditContent v-else />
    </div>

    <div
      v-if="translation.isOpen.value && translation.translation.value"
      class="px-1 my-1"
    >
      <ChatBubbleTranslation :translation="translation" />
    </div>

    <ChatBubbleEditActions v-if="isEditing" />

    <template v-else>
      <div
        class="flex items-center px-2 gap-1 cursor-auto w-fit"
        :class="{ 'self-end': right }"
        @click.stop
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
