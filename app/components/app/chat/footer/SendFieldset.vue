<script setup lang="ts">
import { useMagicKeys, useOnline } from '@vueuse/core'
import { OPTIMISTIC_CHAT_ID } from '~/constants/chat'
import { contentEditableRef, inReplyTos } from '~/store'
import { messageContentSchema, messageContentSchemaChecks } from '~~/server/db/schema'

const { t } = useI18nExperimental()
const isOnline = useOnline()
const { shift } = useMagicKeys()

const route = useRoute()
const username = computed(() => route.params.username as string)

const text = ref('')
const isEmpty = useIsTextEmpty(text)

const chatQuery = useChatQuery(username)
const characterQuery = useCharacterQuery(username)

const queryPromises = [
  chatQuery.suspense(),
  characterQuery.suspense(),
]

await Promise.all(queryPromises)

const chatId = computed(() => chatQuery.data.value?.id || OPTIMISTIC_CHAT_ID)
const inReplyTo = computed(() => inReplyTos[username.value])
const isCharacterDeleted = computed(() => !characterQuery.data.value?.id)
const messageContentSchemaError = computed(() => !!messageContentSchema.safeParse(text.value).error)

const sendMessageMutation = useSendMessage(username, {
  onMutate: ({ isRetrying }) => {
    if (isRetrying)
      return

    text.value = ''
  },
})

const icon = computed(() => {
  if (sendMessageMutation.isPending.value && !isOnline.value)
    return 'material-symbols:signal-wifi-off-outline-rounded'

  if (sendMessageMutation.isPending.value)
    return 'material-symbols:pending-outline'

  if (sendMessageMutation.isError.value && !isOnline.value)
    return 'material-symbols:signal-wifi-off-outline-rounded'

  if (sendMessageMutation.isError.value)
    return 'material-symbols:error-outline-rounded'

  return isEmpty.value ? 'material-symbols:mic-outline-rounded' : 'material-symbols:send-outline-rounded'
})

function handleSend(e: Event) {
  e.preventDefault()

  const decodedMessage = decodeHTML(text.value)

  if (!decodedMessage.trim() || shift.value || sendMessageMutation.isPending.value || sendMessageMutation.isError.value || isCharacterDeleted.value || messageContentSchemaError.value) {
    return
  }

  text.value = decodedMessage

  sendMessageMutation.mutate({
    content: text.value,
    time: now().getTime(),
    inReplyTo: inReplyTo.value,
  })
}
</script>

<template>
  <div class="flex gap-2 px-3 py-2 w-full">
    <div class="tooltip w-full">
      <CharacterDeletedTooltip v-if="isCharacterDeleted" />

      <div class="flex gap-2 items-center justify-center w-full">
        <div class="input input-lg h-full min-h-12 pr-0 input-neutral w-full flex items-center justify-center">
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
        </div>

        <Button
          v-if="!isEmpty"
          class="btn btn-circle btn-primary btn-ghost"
          :disabled="sendMessageMutation.isError.value || sendMessageMutation.isPending.value || isCharacterDeleted || messageContentSchemaError"
          :icon="icon"
          @click="handleSend"
        />
      </div>

      <div v-if="messageContentSchemaError" class="text-xs text-error mt-2">
        {{ t('Message cannot be longer than {max} characters. Current length: {cur}', { max: messageContentSchemaChecks.max, cur: text.length }) }}
      </div>
    </div>
  </div>
</template>
