import { useIsMutating, useMutation, useQueryClient } from '@tanstack/vue-query'
import { useOnline } from '@vueuse/core'
import type { FetchError } from 'ofetch'
import queryKeys from '~/queryKeys'
import { inReplyTos, isPastDueModalOpen } from '~/store'
import type { ChatItem, History } from '~/types'
import { type InReplyTo, MessageStatus } from '~~/db/schema'

interface SendMessageData {
  content: string
  status: MessageStatus
  editing?: boolean
  editingId?: number
  inReplyTo?: InReplyTo
}

interface UseMessageSenderMutationOptions {
  isEditing?: boolean
}

interface UseMessageSenderOptions {
  onMutate?: (options: UseMessageSenderMutationOptions) => void
}

function useMessageSender(username: MaybeRef<string>, options: UseMessageSenderOptions = {}) {
  const queryClient = useQueryClient()
  const { t } = useI18nExperimental()
  const toast = useToast()
  const { goToBottom } = useChatMainScroll()
  // const route = useRoute()

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

  // function handleEdit() {
  //   const messageIndex = data.value.history.findIndex(message => message.id === edition.editingMessageId)
  //   const editingMessage = data.value.history[messageIndex]

  //   handleDelete(edition.editingMessageId!, false)

  //   sendMessage({
  //     value: edition.message!,
  //     editingId: edition.editingMessageId!,
  //     replyingId: editingMessage?.replyingMessage?.id,
  //     replyMessage: editingMessage?.replyingMessage?.message,
  //     replyFrom: editingMessage?.replyingMessage?.from,
  //   })

  //   edition.message = ''
  //   edition.editing = false
  // }

  const fetchMessage = async (data: SendMessageData) => {
    const _username = toValue(username)

    return $fetch(`/api/message/${_username}`, {
      method: 'POST',
      body: {
        content: data.content,
        inReplyTo: data.inReplyTo,
      },
    })
  }

  const messageMutation = useMutation({
    mutationKey: queryKeys.messageSend(username),
    mutationFn: fetchMessage,
    async onMutate(newMessage) {
      delete inReplyTos[toValue(username)]

      options.onMutate?.({
        isEditing: newMessage.editing,
      })

      if (newMessage.editing) {
        // editHistory(newMessage)
        // updateLastMessage(newMessage)

        return
      }

      // newMessageTmp.value = newMessage

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

  function pushMessage(newMessage: SendMessageData) {
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

  function updateLastMessageToError() {
    const _username = toValue(username)

    const newHistory = historyQuery.data.value || []
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

  const isMessageError = computed(() => {
    if (messageMutation.isError.value) {
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

  return {
    sendMessage: messageMutation.mutate,
    isMessagePending: computed(() => isSendMessageMutating.value > 0),
    messageMutation,
    isMessageError,
  }
}

export default useMessageSender
