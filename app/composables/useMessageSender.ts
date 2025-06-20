import { useMutation, useQueryClient } from '@tanstack/vue-query'
import type { FetchError } from 'ofetch'
import queryKeys from '~/queryKeys'
import { isPastDueModalOpen, sendingChatIds, sentErrorChatIds } from '~/store'
import type { Reply } from '~/types'

interface SendMessageData {
  text: string
  refresh?: boolean
  editing?: boolean
  editingId?: number
  replying?: Reply
}

function useMessageSender(username: MaybeRefOrGetter<string>, chatId: MaybeRefOrGetter<number>) {
  const queryClient = useQueryClient()
  const { t } = useI18nExperimental()
  const toast = useToast()

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

  const { mutate: sendMessage, isError: mutationError, isPending: isMessagePending } = messageMutation

  return {
    sendMessage,
    isMessagePending,
    mutationError,
  }
}

export default useMessageSender
