<script setup lang="ts">
import { useLocale } from '@psitta/vue'
import type AudibleText from '~/components/app/ai/AudibleText.vue'
import { edition } from '~/store'
import type { MessageStatus } from '~~/db/schema'

const props = defineProps<{
  right: boolean
  isEditing: boolean
  messageContent: string
  messageStatus: MessageStatus
  messageTime: number
  translation: Translation
}>()
type AudibleTextType = InstanceType<typeof AudibleText>
const audiableTextRef = defineModel<AudibleTextType | null>('audiable-text')

const locale = useLocale()
const { t } = useI18nExperimental()

const time = computed(() => new Intl.DateTimeFormat(locale.value, {
  hour: '2-digit',
  minute: '2-digit',
}).format(new Date(props.messageTime)))

function cancelEdit() {
  edition.editing = false
}

function handleEdit() {
  // TODO: edit message
  console.log('edit')
}
</script>

<template>
  <div
    class="chat-bubble-bg flex flex-col rounded-3xl px-2 py-2 min-w-32 bg-neutral-100"
    :class="[right ? 'rounded-br-md' : 'rounded-bl-md', !isEditing ? 'max-w-[300px] sm:max-w-[400px] lg:max-w-[500px]' : 'w-full']"
  >
    <div class="px-2">
      <AudibleText
        v-if="!isEditing"
        ref="audiableTextRef"
        :text="messageContent"
      />
      <EditBubble v-else />
    </div>

    <div
      v-if="translation.isOpen.value && translation.translation.value"
      class="px-1 my-1"
    >
      <ChatBubbleTranslation :translation="translation" />
    </div>

    <template v-if="isEditing">
      <div class="flex justify-end gap-1">
        <Button
          class="btn btn-sm btn-ghost btn-neutral"
          icon="material-symbols:close-rounded"
          icon-class="text-xl"
          @click="cancelEdit"
        >
          {{ t('Cancel') }}
        </Button>

        <Button
          class="btn btn-sm btn-ghost btn-neutral"
          icon="material-symbols:send-outline-rounded"
          icon-class="text-xl"
          @click="handleEdit"
        >
          {{ t('Send') }}
        </Button>
      </div>
    </template>

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
