<script lang="ts" setup>
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useMagicKeys, useOnline } from '@vueuse/core'
import { useEventListener } from '@vueuse/core/index.cjs'
import type { FetchError } from 'ofetch'
import queryKeys from '~/queryKeys'
import { contentEditableRef, edition, replies, sendingChatIds, sentErrorChatIds } from '~/store'
import { decodeHTML } from '~/utils/web'

const props = defineProps<{
  chatId: number | null
  isCharacterDeleted: boolean
}>()

const emit = defineEmits<{
  (e: 'fixScroll'): void
}>()

const text = defineModel<string>({
  required: true,
})

const queryClient = useQueryClient()
const { t } = useI18nExperimental()
const route = useRoute()
const isOnline = useOnline()
const toast = useToast()

const username = computed(() => route.params.username as string)

const {
  shift,
} = useMagicKeys()

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

function emptyInput() {
  delete replies[username.value]
  text.value = ''
}

interface SendMessageData {
  value: string
  refresh?: boolean
  editing?: boolean
  editingId?: number
  replyingId?: number
  replyMessage?: string
  replyFrom?: 'user' | 'bot'
}

const { mutate: sendMessage, isError: mutationError, isPending: isMessagePending } = useMutation({
  mutationFn: (data: SendMessageData) => $fetch(`/api/message/${route.params.username}`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  async onMutate(newMessage) {
    sendingChatIds.value.add(chatId.value)

    if (newMessage.editing) {
      editHistory(newMessage)
      updateLastMessage(newMessage)

      return
    }

    if (newMessage.refresh)
      return

    newMessageTmp.value = newMessage

    updateHistory(newMessage)
    updateLastMessage(newMessage)
    emptyInput()
    goToBottom()
  },
  onError: async (e) => {
    const error = e as FetchError

    const errorStatus = error.response?.status
    const errorMessage = await error.data?.message

    if (errorStatus === RATE_LIMIT_STATUS_CODE) {
      toast.error(t('You are sending messages too fast. Please wait a moment.'))
    }

    if (errorStatus === PAYMENT_REQUIRED_STATUS_CODE) {
      if (errorMessage === 'PAST_DUE') {
        isPastDueModalOpen.value = true
      }
      else {
        navigateTo('/pricing')
      }
    }

    const newHistory = [...data.value.history || []]

    const lastMessage = newHistory[newHistory.length - 1]

    newHistory[newHistory.length - 1] = {
      ...lastMessage,
      status: 'error',
    }

    updateLastMessage(newMessageTmp.value, true)

    queryClient.setQueryData(queryKeys.chat(route.params.username as string), {
      ...data.value,
      history: newHistory,
    })

    sentErrorChatIds.value.add(chatId.value)
  },
  onSuccess: async (newHistory) => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.chats,
    })

    queryClient.setQueryData(queryKeys.chat(route.params.username as string), {
      ...data.value,
      history: newHistory,
    })

    sentErrorChatIds.value.delete(props.chatId.value)
  },
  onSettled: () => {
    sendingChatIds.value.delete(props.chatId.value)

    emit('fixScroll')
  },
})

function updateHistory(newMessage: SendMessageData) {
  const newHistory = [...data.value.history || []]

  newHistory.push({
    id: newHistory.length + 1,
    from: 'user',
    status: isOnline.value ? 'seen' : 'sending',
    message: newMessage.value,
    replyingMessage: newMessage?.replyingId
      ? {
          id: newMessage!.replyingId!,
          message: newMessage!.replyMessage!,
          from: newMessage!.replyFrom!,
        }
      : null,
    time: new Date().getTime(),
  })

  queryClient.setQueryData(queryKeys.chat(route.params.username as string), {
    ...data.value,
    history: newHistory,
  })
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

    sendMessage({
      value: text.value,
      refresh: false,
      replyingId: replying.value?.id,
      replyMessage: replying.value?.message,
      replyFrom: replying.value?.from,
    })
  }
}

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

const replyMessage = computed(() => replies[username.value])

const translation = useTranslation({
  queryKey: 'footer-input-translation',
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

watch(translation.error, async (value) => {
  if (!value) {
    return
  }

  const error = value as FetchError
  const errorStatus = error.response?.status

  if (errorStatus === RATE_LIMIT_STATUS_CODE) {
    toast.error(t('You are translating messages too fast. Please wait a moment.'))
    return
  }

  toast.error(t('Failed to translate message'))
})

const isReplying = computed(() => !!replies[username.value])
</script>

<template>
  <footer class="bg-white flex items-end justify-center gap-2 w-full">
    <div class="flex flex-col w-full gap-1">
      <ChatFooterInputReply v-if="isReplying" />

      <ChatFooterInput />
    </div>
  </footer>
</template>
