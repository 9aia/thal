import { useIsMutating, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { FetchError } from 'ofetch'
import queryKeys from '~/queryKeys'
import { chatListSearch, inReplyTos, isPastDueModalOpen } from '~/store'
import type { Chats, History, Message } from '~/types'
import { type InReplyTo, type MessageEdit, type MessageSend, MessageStatus } from '~~/db/schema'

interface MessageSending {
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
  const { goToBottom } = useChatMainScroll()
  const localeWithDefaultRegion = useLocaleWithDefaultRegion()
  const historyQuery = useHistoryQuery(username)

  // function editHistory(editedMessage: SendMessageData) {
  // // update the message in the history based on the editedMessage.editingId
  //   const newHistory = [...data.value.history || []]

  //   const messageIndex = newHistory.findIndex(message => message.id === editedMessage.editingId)

  //   if (messageIndex !== -1) {
  //     newHistory[messageIndex] = {
  //       ...newHistory[messageIndex],
  //       message: editedMessage.value,
  //     }
  //   }

  //   queryClient.setQueryData(queryKeys.chat(route.params.username as string), {
  //     ...data.value,
  //     history: newHistory,
  //   })
  // }

  // function updateLastMessage(newMessage: SendMessageData, isError = false) {
  //   const newChat: ChatItem = {
  //     chatId: chatId.value,
  //     contactName: data.value.contact?.name,
  //     username: data.value.username,
  //     lastMessageContent: newMessage.value,
  //     lastMessageStatus: isError ? 'error' : (isOnline.value ? 'seen' : 'sending'),
  //     lastMessageDatetime: new Date().getTime(),
  //     characterName: data.value.name!,
  //   }

  //   queryClient.setQueryData(queryKeys.chatsSearch(localeWithDefaultRegion.value, chatItemSearch.value), (oldData: ChatItem[]) => {
  //     let newChats = [...oldData]

  //     const chatIndex = newChats.findIndex((lastMessage: ChatItem) => lastMessage.username === data.value.username)

  //     if (chatIndex !== -1) {
  //       newChats[chatIndex] = newChat

  //       newChats = swapToFirst(newChats, chatIndex)
  //     }
  //     else {
  //       newChats.unshift(newChat)
  //     }

  //     return newChats
  //   })
  // }

  // const newMessageTmp = ref()

  // function handleResend() {
  //   const lastMessage = data.value.history[data.value.history.length - 1]

  //   if (lastMessage.status === 'error') {
  //     sendMessage({
  //       value: lastMessage.message,
  //       refresh: true,
  //       replyingId: replying.value?.id,
  //       replyMessage: replying.value?.message,
  //       replyFrom: replying.value?.from,
  //     })
  //   }
  // }

  const sendMessageFn = async (data: MessageSending) => {
    const _username = toValue(username)

    const message: MessageSend = {
      content: data.content,
      inReplyTo: data.inReplyTo,
    }

    return $fetch(`/api/message/${_username}`, {
      method: 'POST',
      body: message,
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

      goToBottom()
    },
    onError: async (e, sendingMessage) => {
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
        content: sendingMessage.content,
        time: sendingMessage.time,
        status: MessageStatus.error,
      })
    },
    onSuccess: async (newHistory) => {
      const _username = toValue(username)

      queryClient.setQueryData(queryKeys.history(_username), newHistory)

      const lastMessageFromHistory = newHistory[newHistory.length - 1]
      setChatItemLastMessage({
        content: lastMessageFromHistory.content,
        time: lastMessageFromHistory.time,
        status: lastMessageFromHistory.status,
      })
    },
    onSettled: () => {
      goToBottom()
    },
  })

  const editMessageFn = async (data: MessageEdit) => {
    const _username = toValue(username)

    return $fetch(`/api/message/${_username}`, {
      method: 'POST',
      body: {
        content: data.content,
        inReplyTo: data.inReplyTo,
      },
    })
  }

  const editMessageMutation = useMutation({
    mutationKey: queryKeys.messageEdit(username),
    mutationFn: editMessageFn,
    async onMutate(newMessage) {
      options.onEditMutate?.()

      editMessage(newMessage)

      const messageIndex = historyQuery.data.value?.findIndex(message => message.id === newMessage.id)
      const isLastMessageBeingEdited = messageIndex === (historyQuery.data.value?.length || 0) - 1

      if (isLastMessageBeingEdited) {
        setChatItemLastMessage({
          content: newMessage.content,
          time: now().getTime(),
          status: MessageStatus.sending,
        })
      }

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

      updatePredictedUserMessageStatusToError()
    },
    onSuccess: async (newHistory) => {
      const _username = toValue(username)

      queryClient.setQueryData(queryKeys.history(_username), newHistory)

      const lastMessageFromHistory = newHistory[newHistory.length - 1]
      setChatItemLastMessage({
        content: lastMessageFromHistory.content,
        time: lastMessageFromHistory.time,
        status: lastMessageFromHistory.status,
      })
    },
  })

  // const editMessageMutation = useMutation()

  // function handleEdit(editingMessageI: number, newMessage: string) {
  //   const history = historyQuery.data.value || []

  //   const messageIndex = history.findIndex(message => message.id === editingMessageI)
  //   const editingMessage = history[messageIndex]

  //   // messageMutation.mutate(editingMessageI!, false)

  //   messageMutation.mutate({
  //     value: newMessage!,
  //     editingId: editingMessageI!,
  //     replyingId: editingMessage?.replyingMessage?.id,
  //     replyMessage: editingMessage?.replyingMessage?.message,
  //     replyFrom: editingMessage?.replyingMessage?.from,
  //   })

  //   edition.message = ''
  //   edition.editing = false
  // }

  function setChatItemLastMessage(lastMessage: { content: string, time: number, status: MessageStatus }) {
    const _username = toValue(username)

    queryClient.setQueryData(queryKeys.chatsSearch(localeWithDefaultRegion.value, chatListSearch.value), (oldChats: Chats) => {
      console.log(JSON.stringify({ oldChats, lastMessage }, null, 2))

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

  function pushPredictedUserMessage(newMessage: MessageSending) {
    const _username = toValue(username)
    const history = historyQuery.data.value || []

    const predictedUserMessage: Message = {
      id: history.length + 1,
      from: 'user',
      content: newMessage.content,
      time: newMessage.time,
      status: MessageStatus.sending,
      inReplyTo: newMessage?.inReplyTo || null,
    }

    queryClient.setQueryData(queryKeys.history(_username), [
      ...(history as History),
      predictedUserMessage,
    ])
  }

  function editMessage(newMessage: MessageEdit) {
    const _username = toValue(username)
    const history = historyQuery.data.value || []

    const messageIndex = history.findIndex(message => message.id === newMessage.id)

    if (messageIndex !== -1) {
      const updatedMessage = {
        ...history[messageIndex],
        content: newMessage.content,
        status: MessageStatus.sending,
      }

      const updatedHistory = [...history]
      updatedHistory[messageIndex] = updatedMessage

      queryClient.setQueryData(queryKeys.history(_username), updatedHistory)
    }

    const isLastMessageBeingEdited = messageIndex === history.length - 1

    if (isLastMessageBeingEdited) {
      setChatItemLastMessage({
        content: newMessage.content,
        time: now().getTime(),
        status: MessageStatus.sending,
      })
    }
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
    editMessage: editMessageMutation.mutate,
    isEditMessagePending: computed(() => isEditMessageMutating.value > 0),
    isEditMessageError: editMessageMutation.isPending,
  }
}

export default useMessageSender
