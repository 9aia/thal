<script setup lang="ts">
import { useMagicKeys, useOnline } from '@vueuse/core'
import { OPTIMISTIC_CHAT_ID } from '~/constants/chat'
import { contentEditableRef, inReplyTos } from '~/store'
import { MessageStatus } from '~~/db/schema'

const { t } = useI18nExperimental()
const isOnline = useOnline()
const { shift } = useMagicKeys()

const route = useRoute()
const username = computed(() => route.params.username as string)

const text = ref('')
const isEmpty = useIsTextEmpty(text)

const chatQuery = useChatQuery(username)
const characterQuery = useCharacterQuery(username)

const chatId = computed(() => chatQuery.data.value?.id || OPTIMISTIC_CHAT_ID)
const inReplyTo = computed(() => inReplyTos[username.value])
const isCharacterDeleted = computed(() => !characterQuery.data.value?.id)

const { sendMessage, isMessagePending, isMessageError } = useMessageSender(username, {
  onMutate: (options) => {
    if (options.isEditing) {
      return
    }

    text.value = ''
  },
})

const icon = computed(() => {
  if (isMessagePending.value && !isOnline.value)
    return 'material-symbols:signal-wifi-off-outline-rounded'

  if (isMessagePending.value)
    return 'material-symbols:pending-outline'

  if (isMessageError.value && !isOnline.value)
    return 'material-symbols:signal-wifi-off-outline-rounded'

  if (isMessageError.value)
    return 'material-symbols:error-outline-rounded'

  return isEmpty.value ? 'material-symbols:mic-outline-rounded' : 'material-symbols:send-outline-rounded'
})

function handleSend(e: Event) {
  e.preventDefault()

  const decodedMessage = decodeHTML(text.value)

  if (!decodedMessage.trim() || isMessagePending.value || isMessageError.value || shift.value) {
    return
  }

  text.value = decodedMessage

  sendMessage({
    content: text.value,
    inReplyTo: inReplyTo.value,
    status: MessageStatus.sending,
  })
}
</script>

<template>
  <div class="flex gap-2 px-3 py-2 w-full">
    <div class="tooltip w-full">
      <CharacterDeletedTooltip v-if="isCharacterDeleted" />

      <div class="flex gap-2 items-center justify-center w-full">
        <label class="input input-lg h-full min-h-12 pr-0 input-neutral w-full flex items-center justify-center" for="input">
          <div class="flex gap-1 items-center justify-center">
            <TranslateButton
              v-model:text="text"
              :chat-id="chatId"
            />
          </div>

          <ContentEditable
            is="span"
            ref="contentEditableRef"
            v-model="text"
            :disabled="isCharacterDeleted"
            class="w-full text-wrap outline-hidden !max-h-48 overflow-y-auto pr-4"
            :class="{ 'cursor-not-allowed': isCharacterDeleted }"
            :placeholder="t('Type a message...')"
            placeholder-color="var(--color-gray-500)"
            @keydown.enter="handleSend"
          />
        </label>

        <Button
          v-if="!isEmpty"
          class="btn btn-circle btn-neutral btn-ghost"
          :disabled="isMessageError || isMessagePending || isCharacterDeleted"
          :icon="icon"
          @click="handleSend"
        />
      </div>
    </div>
  </div>
</template>
