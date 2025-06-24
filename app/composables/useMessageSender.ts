import { useIsMutating, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { FetchError } from 'ofetch'
import queryKeys from '~/queryKeys'
import { chatListSearch, inReplyTos, isPastDueModalOpen } from '~/store'
import type { Chats, History, Message } from '~/types'
import { type InReplyTo, type MessagePost, MessageStatus } from '~~/db/schema'

interface MessageSending {
  content: string
  time: number
  inReplyTo?: InReplyTo
}

interface MessageEditing {
  id: number
  content: string
  time: number
  inReplyTo?: InReplyTo
}

interface UseMessageSenderOptions {
  onSendMutate?: () => void
  onEditMutate?: () => void
}

function useMessageSender(username: MaybeRef<string>, options: UseMessageSenderOptions = {}) {
  const queryClient = useQueryClient()
  const { t } = useI18nExperimental()
  const toast = useToast()
  const { scrollBottom } = useChatMainScroll()
  const localeWithDefaultRegion = useLocaleWithDefaultRegion()
  const historyQuery = useHistoryQuery(username)

  async function onError(e: unknown, message: MessageSending | MessageEditing) {
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

    updatePredictedUserMessageStatusToError()

    setChatItemLastMessage({
      content: message.content,
      time: message.time,
      status: MessageStatus.error,
    })
  }

  function updatePredictedUserMessageStatusToError() {
    const _username = toValue(username)

    queryClient.setQueryData(queryKeys.history(_username), (oldHistory: History) => {
      const lastMessageFromHistory = oldHistory[oldHistory.length - 1]
      const historyWithoutLastMessage = oldHistory.slice(0, -1)

      const updatedLastMessageFromHistory = {
        ...lastMessageFromHistory,
        status: MessageStatus.error,
      }

      return [
        ...historyWithoutLastMessage,
        updatedLastMessageFromHistory,
      ]
    })
  }

  async function sendMessageFn(data: MessageSending) {
    const _username = toValue(username)

    const message: MessagePost = {
      content: data.content,
      inReplyTo: data.inReplyTo,
    }

    return $fetch(`/api/message/${_username}`, {
      method: 'POST',
      body: message,
    })
  }

  async function onSuccess(newHistory: History) {
    const _username = toValue(username)

    queryClient.setQueryData(queryKeys.history(_username), newHistory)

    const lastMessageFromHistory = newHistory[newHistory.length - 1]
    setChatItemLastMessage({
      content: lastMessageFromHistory.content,
      time: lastMessageFromHistory.time,
      status: lastMessageFromHistory.status,
    })
  }

  const sendMessageMutation = useMutation({
    mutationKey: queryKeys.messageSend(username),
    mutationFn: sendMessageFn,
    async onMutate(sendingMessage) {
      delete inReplyTos[toValue(username)]

      options.onSendMutate?.()

      pushPredictedUserMessage(sendingMessage)
      setChatItemLastMessage({
        content: sendingMessage.content,
        time: sendingMessage.time,
        status: MessageStatus.sending,
      })

      scrollBottom()
    },
    onError,
    onSuccess,
    onSettled: () => {
      scrollBottom()
    },
  })

  const editMessageFn = (data: MessageEditing) => sendMessageFn(data)

  const editMessageMutation = useMutation({
    mutationKey: queryKeys.messageEdit(username),
    mutationFn: editMessageFn,
    async onMutate(editingMessage) {
      options.onEditMutate?.()

      editPredictedUserMessage(editingMessage)
      setChatItemLastMessage({
        content: editingMessage.content,
        time: editingMessage.time,
        status: MessageStatus.sending,
      })
    },
    onError,
    onSuccess,
  })

  function setChatItemLastMessage(lastMessage: { content: string, time: number, status: MessageStatus }) {
    const _username = toValue(username)

    queryClient.setQueryData(queryKeys.chatsSearch(localeWithDefaultRegion.value, chatListSearch.value), (oldChats: Chats) => {
      const newChats = [...oldChats]
      const chatIndex = newChats.findIndex(chat => chat.username === _username)

      if (chatIndex !== -1) {
        newChats[chatIndex] = {
          ...newChats[chatIndex],
          lastMessageContent: lastMessage.content,
          lastMessageDatetime: lastMessage.time,
          lastMessageStatus: lastMessage.status,
        }
      }

      return newChats
    })
  }

  function pushPredictedUserMessage(sendingMessage: MessageSending) {
    const _username = toValue(username)

    const predictedUserMessage: Message = {
      id: history.length + 1,
      from: 'user',
      content: sendingMessage.content,
      time: sendingMessage.time,
      status: MessageStatus.sending,
      inReplyTo: sendingMessage?.inReplyTo || null,
    }

    queryClient.setQueryData(queryKeys.history(_username), (oldHistory: History) => {
      return [
        ...(oldHistory as History),
        predictedUserMessage,
      ]
    })
  }

  async function editPredictedUserMessage(editingMessage: MessageEditing) {
    const _username = toValue(username)

    queryClient.setQueryData(queryKeys.history(_username), (oldHistory: History) => {
      const predictedMessage = oldHistory[oldHistory.length - 1]
      const historyWithoutPredictedMessage = oldHistory.slice(0, -1)
      const updatedPredictedMessage = {
        ...predictedMessage,
        content: editingMessage.content,
        time: editingMessage.time,
        status: MessageStatus.sending,
        inReplyTo: editingMessage?.inReplyTo || null,
      }

      return [
        ...historyWithoutPredictedMessage,
        updatedPredictedMessage,
      ]
    })
  }

  const isSendMessageError = computed(() => {
    if (sendMessageMutation.isError.value) {
      return true
    }

    if (!historyQuery.data.value || historyQuery.data.value.length === 0) {
      return false
    }

    const lastMessageFromHistory = historyQuery.data.value[historyQuery.data.value.length - 1]
    return lastMessageFromHistory.status === MessageStatus.error
  })

  const isSendMessageMutating = useIsMutating({
    mutationKey: queryKeys.messageSend(username),
  })
  const isEditMessageMutating = useIsMutating({
    mutationKey: queryKeys.messageEdit(username),
  })

  return {
    sendMessage: sendMessageMutation.mutate,
    isSendMessagePending: computed(() => isSendMessageMutating.value > 0),
    isSendMessageError,
    isError: computed(() => sendMessageMutation.isError.value),
    editMessage: editMessageMutation.mutate,
    isEditMessagePending: computed(() => isEditMessageMutating.value > 0),
    isEditMessageError: editMessageMutation.isPending,
  }
}

export default useMessageSender
