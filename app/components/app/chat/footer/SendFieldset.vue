<script setup lang="ts">
import { useMagicKeys, useOnline } from '@vueuse/core'
import { contentEditableRef, inReplyTos, sendingChatIds, sentErrorChatIds } from '~/store'

const props = defineProps<{
  chatId: number
}>()

const text = defineModel<string>({
  default: '',
})

const { t } = useI18nExperimental()
const route = useRoute()
const isOnline = useOnline()
const {
  shift,
} = useMagicKeys()

const username = computed(() => route.params.username as string)
const characterQuery = useCharacterQuery(username)
const isEmpty = useIsTextEmpty(toRef(() => text.value))
const { sendMessage } = useMessageSender(username, toRef(() => props.chatId))

// TODO: refactor this
const isChatError = computed(() => props.chatId ? sentErrorChatIds.value.has(props.chatId) : false)
const isChatSending = computed(() => props.chatId ? sendingChatIds.value.has(props.chatId) : false)
const isCharacterDeleted = computed(() => !characterQuery.data.value?.id)

const replying = computed(() => {
  const username = route.params.username as string
  return inReplyTos[username]
})

const icon = computed(() => {
  if (isChatSending.value && !isOnline.value)
    return 'material-symbols:signal-wifi-off-outline-rounded'

  if (isChatSending.value)
    return 'material-symbols:pending-outline'

  if (isChatError.value && !isOnline.value)
    return 'material-symbols:signal-wifi-off-outline-rounded'

  if (isChatError.value)
    return 'material-symbols:error-outline-rounded'

  return isEmpty.value ? 'material-symbols:mic-outline-rounded' : 'material-symbols:send-outline-rounded'
})

function handleSend(e: Event) {
  e.preventDefault()

  const decodedMessage = decodeHTML(text.value)

  if (!decodedMessage.trim() || isChatSending.value || isChatError.value || shift.value) {
    return
  }

  text.value = decodedMessage

  sendMessage({
    text: text.value,
    refresh: false,
    replying: replying.value,
  })
}
</script>

<template>
  <div class="flex gap-2 px-3 py-2 w-full">
    <div class="tooltip w-full">
      <div v-if="isCharacterDeleted" class="tooltip-content max-w-lg rounded-2xl">
        <div class="px-4 py-2 text-orange-500 text-sm bg-radial-[at_bottom] from-orange-50 to-gray-50">
          {{ t('You can\'t message this character — they have been deleted.') }}
        </div>
      </div>

      <div class="flex gap-2 items-center justify-center w-full">
        <label class="input input-lg input-neutral w-full flex items-center justify-center" for="input">
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
            class="flex w-full items-center outline-hidden"
            :placeholder="t('Type a message...')"
            @keydown.enter="handleSend"
          />
        </label>

        <Button
          v-if="!isEmpty"
          class="btn btn-circle btn-neutral btn-ghost"
          :disabled="isChatError || isChatSending || isCharacterDeleted"
          :icon="icon"
          @click="handleSend"
        />
      </div>
    </div>
  </div>
</template>
