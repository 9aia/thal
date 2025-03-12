<script lang="ts" setup>
import { useMagicKeys, useOnline } from '@vueuse/core'
import { useQueryClient } from '@tanstack/vue-query'
import { useEventListener } from '@vueuse/core/index.cjs'
import { contentEditableRef, editingBubbleData, replies, sendingChatIds, sentErrorChatIds } from '~/store'
import queryKeys from '~/queryKeys'

const props = defineProps<{
  chatId: number | null
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

function removeHtmlTags(str: string) {
  return str.replace(/<[^>]*>/g, '')
}

const isEmpty = ref(true)

watch(text, () => {
  const plainText = removeHtmlTags(text.value)

  isEmpty.value = !plainText
})

const icon = computed(() => {
  if (isChatSending.value && !isOnline.value)
    return 'wifi_off'

  if (isChatSending.value)
    return 'pending'

  if (isChatError.value && !isOnline.value)
    return 'wifi_off'

  if (isChatError.value)
    return 'error'

  return isEmpty.value ? 'mic' : 'send'
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

        <div role="button" class="btn btn-xs btn-ghost btn-circle absolute top-1 right-1" @click="removeReply">
          <Icon name="close" style="font-size: 1rem" />
        </div>
      </div>

      <div class="flex gap-2 px-3 py-2">
        <div class="flex-1 flex flex-col">
          <label class="input bg-gray-50 flex gap-1 w-full h-full items-center justify-center p-2 textarea" for="input">
            <Button
              v-if="!isEmpty" size="sm" shape="circle" :disabled="isChatError || isChatSending || undefined"
              class="btn-ghost" :loading="translation.isLoading.value" @click="translation.onTranslate()"
            >
              <Icon name="translate" class="text-base" />
            </Button>

            <ContentEditable
              is="span" id="input" ref="contentEditableRef" v-model="text"
              class="flex w-full items-center text-sm outline-none" placeholder="Type a message"
              @keydown.enter="handleSend"
            />
          </label>
        </div>

        <div
          v-if="!isEmpty" role="button" class="btn btn-ghost btn-circle avatar"
          :disabled="isChatError || isChatSending || undefined" @click="handleSend"
        >
          <Icon :name="icon" />
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.bg-gradient-6 {
  background: radial-gradient(circle, theme('colors.white'), theme('colors.magenta.50'));
}
</style>
