import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useEventListener } from '@vueuse/core'
import type { FetchError } from 'ofetch'
import queryKeys from '~/queryKeys'
import { contentEditableRef, edition, inReplyTos, isPastDueModalOpen, sendingChatIds, sentErrorChatIds } from '~/store'
import type { ChatItem } from '~/types'
import type { InReplyTo } from '~~/db/schema'

interface SendMessageData {
  text: string
  refresh?: boolean
  editing?: boolean
  editingId?: number
  replying?: InReplyTo
}

function useMessageSender(username: MaybeRefOrGetter<string>, chatId: MaybeRefOrGetter<number>) {
  const queryClient = useQueryClient()
  const { t } = useI18nExperimental()
  const toast = useToast()
  const { goToBottom } = useChatHistoryScroll()
  const route = useRoute()

  function emptyInput() {
    delete inReplyTos[username.value]
    text.value = ''
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

  function editHistory(editedMessage: SendMessageData) {
  // update the message in the history based on the editedMessage.editingId
    const newHistory = [...data.value.history || []]

    const messageIndex = newHistory.findIndex(message => message.id === editedMessage.editingId)

    if (messageIndex !== -1) {
      newHistory[messageIndex] = {
        ...newHistory[messageIndex],
        message: editedMessage.value,
      }
    }

    queryClient.setQueryData(queryKeys.chat(route.params.username as string), {
      ...data.value,
      history: newHistory,
    })
  }

  function updateLastMessage(newMessage: SendMessageData, isError = false) {
    const newChat: ChatItem = {
      chatId: chatId.value,
      contactName: data.value.contact?.name,
      username: data.value.username,
      lastMessageContent: newMessage.value,
      lastMessageStatus: isError ? 'error' : (isOnline.value ? 'seen' : 'sending'),
      lastMessageDatetime: new Date().getTime(),
      characterName: data.value.name!,
    }

    queryClient.setQueryData(queryKeys.chatsSearch(localeWithDefaultRegion.value, chatItemSearch.value), (oldData: ChatItem[]) => {
      let newChats = [...oldData]

      const chatIndex = newChats.findIndex((lastMessage: ChatItem) => lastMessage.username === data.value.username)

      if (chatIndex !== -1) {
        newChats[chatIndex] = newChat

        newChats = swapToFirst(newChats, chatIndex)
      }
      else {
        newChats.unshift(newChat)
      }

      return newChats
    })
  }

  const newMessageTmp = ref()

  const messageError = computed(() => {
    if (mutationError.value) {
      return true
    }

    if (!data.value) {
      return false
    }

    if (data.value.history.length === 0) {
      return false
    }

    if (data.value.history[data.value.history.length - 1].status === 'error') {
      return true
    }

    return false
  })

  function handleResend() {
    const lastMessage = data.value.history[data.value.history.length - 1]

    if (lastMessage.status === 'error') {
      sendMessage({
        value: lastMessage.message,
        refresh: true,
        replyingId: replying.value?.id,
        replyMessage: replying.value?.message,
        replyFrom: replying.value?.from,
      })
    }
  }

  function handleEdit() {
    const messageIndex = data.value.history.findIndex(message => message.id === edition.editingMessageId)
    const editingMessage = data.value.history[messageIndex]

    handleDelete(edition.editingMessageId!, false)

    sendMessage({
      value: edition.message!,
      editingId: edition.editingMessageId!,
      replyingId: editingMessage?.replyingMessage?.id,
      replyMessage: editingMessage?.replyingMessage?.message,
      replyFrom: editingMessage?.replyingMessage?.from,
    })

    edition.message = ''
    edition.editing = false
  }

  const fetchMessage = async (data: SendMessageData) => {
    const _username = toValue(username)

    return $fetch(`/api/message/${_username}`, {
      method: 'POST',
      body: data,
    })
  }

  const messageMutation = useMutation({
    mutationFn: fetchMessage,
    async onMutate(newMessage) {
      const _chatId = toValue(chatId)

      sendingChatIds.value.add(_chatId)

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
      const _username = toValue(username)
      const _chatId = toValue(chatId)
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

      queryClient.setQueryData(queryKeys.chat(_username), {
        ...data.value,
        history: newHistory,
      })

      sentErrorChatIds.value.add(_chatId)
    },
    onSuccess: async (newHistory) => {
      const _username = toValue(username)

      queryClient.invalidateQueries({
        queryKey: queryKeys.chats,
      })

      queryClient.setQueryData(queryKeys.chat(_username), {
        ...data.value,
        history: newHistory,
      })

      sentErrorChatIds.value.delete(_chatId)
    },
    onSettled: () => {
      sendingChatIds.value.delete(_chatId)

      goToBottom()
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

  const { mutate: sendMessage, isError: mutationError, isPending: isMessagePending } = messageMutation

  return {
    sendMessage,
    isMessagePending,
    mutationError,
  }
}

export default useMessageSender
