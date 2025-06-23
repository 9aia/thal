import { useMutation, useQueryClient } from '@tanstack/vue-query'
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
  const isOnline = useOnline()
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

    console.log(data)

    return $fetch(`/api/message/${_username}`, {
      method: 'POST',
      body: {
        content: data.content,
        inReplyTo: data.inReplyTo,
      },
    })
  }

  const messageMutation = useMutation({
    mutationFn: fetchMessage,
    async onMutate(newMessage) {
      delete inReplyTos[toValue(username)]
      options.onMutate?.({
        isEditing: newMessage.editing,
      })

      // TODO: remove this after refactoring sendingChatIds
      if (newMessage.editing) {
        // editHistory(newMessage)
        // updateLastMessage(newMessage)

        return
      }

      // newMessageTmp.value = newMessage

      pushMessage(newMessage)
      setLastMessage({
        content: newMessage.content,
        time: now().getTime(),
        status: isOnline.value ? MessageStatus.sent : MessageStatus.sending,
      })

      goToBottom()
    },
    onError: async (e) => {
      const _username = toValue(username)
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

      // const newHistory = [...data.value.history || []]

      // const lastMessage = newHistory[newHistory.length - 1]

      // newHistory[newHistory.length - 1] = {
      //   ...lastMessage,
      //   status: 'error',
      // }

      // updateLastMessage(newMessageTmp.value, true)

      // queryClient.setQueryData(queryKeys.chat(_username), {
      //   ...data.value,
      //   history: newHistory,
      // })
    },
    onSuccess: async (newHistory) => {
      const _username = toValue(username)

      queryClient.setQueryData(queryKeys.history(_username), newHistory)

      const lastMessageFromHistory = newHistory[newHistory.length - 1]
      setLastMessage({
        content: lastMessageFromHistory.content,
        time: lastMessageFromHistory.time,
        status: lastMessageFromHistory.status,
      })
    },
    onSettled: () => {
      goToBottom()
    },
  })

  function setLastMessage(lastMessage: { content: string, time: number, status: MessageStatus }) {
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
      status: isOnline.value ? MessageStatus.seen : MessageStatus.sending,
      content: newMessage.content,
      inReplyTo: newMessage?.inReplyTo || null,
      time: new Date().getTime(),
    }

    queryClient.setQueryData(queryKeys.history(_username), [
      ...(history as History),
      newMessageData,
    ])
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

  return {
    sendMessage: messageMutation.mutate,
    isMessagePending: messageMutation.isPending,
    isMessageError,
  }
}

export default useMessageSender
