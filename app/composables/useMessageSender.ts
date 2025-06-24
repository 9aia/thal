import { useIsMutating, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { FetchError } from 'ofetch'
import queryKeys from '~/queryKeys'
import { inReplyTos, isPastDueModalOpen } from '~/store'
import type { ChatItem, History } from '~/types'
import { type MessageEdit, type MessageSend, MessageStatus } from '~~/db/schema'

interface UseMessageSenderOptions {
  onSendMutate?: () => void
  onEditMutate?: () => void
}

function useMessageSender(username: MaybeRef<string>, options: UseMessageSenderOptions = {}) {
  const queryClient = useQueryClient()
  const { t } = useI18nExperimental()
  const toast = useToast()
  const { goToBottom } = useChatMainScroll()

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

  const sendMessageFn = async (data: MessageSend) => {
    const _username = toValue(username)

    return $fetch(`/api/message/${_username}`, {
      method: 'POST',
      body: data,
    })
  }

  const sendMessageMutation = useMutation({
    mutationKey: queryKeys.messageSend(username),
    mutationFn: sendMessageFn,
    async onMutate(newMessage) {
      delete inReplyTos[toValue(username)]

      options.onSendMutate?.()

      pushMessage(newMessage)
      setChatItemLastMessage({
        content: newMessage.content,
        time: now().getTime(),
        status: MessageStatus.sending,
      })

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

      updateLastMessageToError()
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

      updateLastMessageToError()
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
    const chat = queryClient.getQueryData(queryKeys.chat(_username)) as ChatItem

    queryClient.setQueryData(queryKeys.chat(_username), {
      ...chat,
      lastMessageContent: lastMessage.content,
      lastMessageDatetime: lastMessage.time,
      lastMessageStatus: lastMessage.status,
    })
  }

  function pushMessage(newMessage: MessageSend) {
    const _username = toValue(username)
    const history = historyQuery.data.value || []

    const newMessageData: History[number] = {
      id: history.length + 1,
      from: 'user',
      status: newMessage.status,
      content: newMessage.content,
      inReplyTo: newMessage?.inReplyTo || null,
      time: new Date().getTime(),
    }

    queryClient.setQueryData(queryKeys.history(_username), [
      ...(history as History),
      newMessageData,
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

  function updateLastMessageToError() {
    const _username = toValue(username)
    const history = historyQuery.data.value || []

    const newHistory = [...history]
    const lastMessageFromHistory = newHistory[newHistory.length - 1]

    newHistory[newHistory.length - 1] = {
      ...lastMessageFromHistory,
      status: MessageStatus.error,
    }

    queryClient.setQueryData(queryKeys.history(_username), newHistory)

    setChatItemLastMessage({
      content: lastMessageFromHistory.content,
      time: lastMessageFromHistory.time,
      status: lastMessageFromHistory.status,
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
