<script lang="ts" setup>
import { useMagicKeys, useOnline } from '@vueuse/core'
import { useQueryClient } from '@tanstack/vue-query'
import { useEventListener } from '@vueuse/core/index.cjs'
import { contentEditableRef, edition, replies, sendingChatIds, sentErrorChatIds } from '~/store'
import queryKeys from '~/queryKeys'

const props = defineProps<{
  chatId: number | null
  isCharacterDeleted: boolean
}>()

const emit = defineEmits<{
  (e: 'send'): void
}>()

const text = defineModel<string>({
  required: true,
})

const queryClient = useQueryClient()

const { t } = useI18nExperimental()
const route = useRoute()

const username = computed(() => route.params.username as string)

const {
  shift,
} = useMagicKeys()
const isOnline = useOnline()

const isChatError = computed(() => props.chatId ? sentErrorChatIds.value.has(props.chatId) : false)
const isChatSending = computed(() => props.chatId ? sendingChatIds.value.has(props.chatId) : false)

const isEmpty = useIsTextEmpty(text)

const icon = computed(() => {
  if (isChatSending.value && !isOnline.value)
    return 'material-symbols:wifi-off'

  if (isChatSending.value)
    return 'material-symbols:pending-outline'

  if (isChatError.value && !isOnline.value)
    return 'material-symbols:wifi-off'

  if (isChatError.value)
    return 'material-symbols:error-outline-rounded'

  return isEmpty.value ? 'material-symbols:mic-outline' : 'material-symbols:send-outline'
})

function decodeHTML(html: string) {
  const txt = document.createElement('textarea')
  txt.innerHTML = html
  return txt.value
}

function handleSend(e: Event) {
  const message = decodeHTML(text.value)

  if (!message.trim() || isChatSending.value || isChatError.value) {
    e.preventDefault()
    return
  }

  if (!shift.value) {
    e.preventDefault()

    text.value = message

    emit('send')
  }
}

function removeReply() {
  delete replies[username.value]
}

const replying = computed(() => replies[username.value])

const data = computed(() => queryClient.getQueryData(queryKeys.chat(username)))
const { displayName } = useContactInfo(data)

const replyDisplayName = computed(() => replying.value.from === 'user'
  ? t('You')
  : displayName.value,
)

onMounted(() => {
  const chatContainer = document.querySelector('#chat-container')

  useEventListener(chatContainer, 'keydown', (event: KeyboardEvent) => {
    if (edition.editing) {
      return
    }

    // Ignore modifier keys
    if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey)
      return

    // Explicitly check for 'Meta' key (some browsers may not set event.metaKey reliably)
    if (event.key === 'Meta')
      return

    // Ignore function keys (F1-F12) and Escape
    if (event.key.startsWith('F') || event.key === 'Escape')
      return

    contentEditableRef.value?.focus()
  })

  contentEditableRef.value?.focus()
})

const isReplying = computed(() => !!replies[username.value])
const replyMessage = computed(() => replies[username.value])

const translation = useTranslation({
  message: text,
  replyMessageId: computed(() => replyMessage.value ? replyMessage.value.id : undefined),
  chatUsername: username,
  toNative: false,
  refetchOnTranslate: true,
  messageIsBot: false,
})

watch(translation.isLoading, (value) => {
  if (value || translation.isError.value) {
    return
  }

  text.value = translation.translation.value!
})
</script>

<template>
  <footer class="bg-white flex items-end justify-center gap-2 w-full">
    <div class="flex flex-col w-full gap-1">
      <div v-if="isReplying" class="border-l-4 border-blue-100 bg-blue-50 p-3 relative w-full">
        <h3 class="text-sm font-medium text-blue-500">
          {{ replyDisplayName }}
        </h3>

        <p class="text-xs text-gray-600 line-clamp-3">
          {{ replyMessage.message }}
        </p>

        <Button shape="circle" size="xs" class="btn-ghost absolute top-1 right-1" @click="removeReply">
          <Icon name="material-symbols:close" class="text-sm" />
        </Button>
      </div>

      <div class="flex gap-2 px-3 py-2">
        <div class="flex-1 flex flex-col tooltip-center bg-gradient-2" :class="{ tooltip: isCharacterDeleted }" :data-tip="t('You can\'t message this character — they have been deleted.')">
          <label class="input bg-gray-50 flex gap-1 w-full h-full items-center justify-center p-2 textarea" for="input">
            <Button
              v-if="!isEmpty" size="sm" shape="circle" :disabled="isChatError || isChatSending || undefined"
              class="btn-ghost" :loading="translation.isLoading.value" @click="translation.onTranslate()"
            >
              <Icon name="material-symbols:translate" class="text-base" />
            </Button>

            <ContentEditable
              is="span" id="input" ref="contentEditableRef" v-model="text"
              :disabled="isCharacterDeleted"
              class="flex w-full items-center text-sm outline-none"
              :placeholder="t('Type a message...')"
              @keydown.enter="handleSend"
            />
          </label>
        </div>

        <Button
          v-if="!isEmpty"
          class="btn-ghost"
          size="md"
          shape="circle"
          :disabled="isChatError || isChatSending || undefined"
          @click="handleSend"
        >
          <Icon :name="icon" />
        </Button>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.bg-gradient-6 {
  background: radial-gradient(circle, theme('colors.white'), theme('colors.magenta.50'));
}

.tooltip::before {
  @apply px-4 py-2 rounded-lg text-blue-500 max-w-xs sm:max-w-2xl md:max-w-3xl text-sm;
  background: radial-gradient(at bottom, theme('colors.blue.50'), theme('colors.gray.50'));
}
</style>
