import { useIsMutating, useMutation, useMutationState } from '@tanstack/vue-query'
import type { FetchError } from 'ofetch'
import queryKeys from '~/queryKeys'
import { edition, inReplyTos, isSubscriptionStatusModalOpen } from '~/store'
import type { History, MessageSend } from '~/types'
import { type MessagePost, MessageStatus } from '~~/db/schema'

export interface UseSendMessageOptions {
  onMutate?: ({ isRetrying }: { isRetrying: boolean }) => void
}

function useSendMessage(username: MaybeRef<string>, options: UseSendMessageOptions = {}) {
  const { t } = useI18nExperimental()
  const toast = useToast()
  const { scrollBottom } = useChatMainScroll()
  const historyClient = useHistoryClient(username)
  const chatClient = useChatClient(username)
  const sendMessageStatus = useSendMessageMutationStatus(username)
  const chatQueryUtils = useChatQueryUtils(username)
  const historyQueryUtils = useHistoryQueryUtils(username)
  const historyQuery = useHistoryQuery(username)

  async function fetchMessage(data: MessageSend) {
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

  const sendMessageMutation = useMutation({
    mutationKey: queryKeys.messageSend(username),
    mutationFn: fetchMessage,
    async onMutate(message) {
      const isRetrying = !!message.id

      options.onMutate?.({ isRetrying })

      chatClient.createIfNotExists({
        messageContent: message.content,
        messageDatetime: message.time,
        messageStatus: MessageStatus.sending,
      })

      if (isRetrying) {
        chatQueryUtils.updateInReplyToBeingLastMessage({
          content: message.content,
          status: MessageStatus.sending,
        })

        // Update predicted user message to retry
        historyClient.updateLastMessage({
          content: message.content,
          time: message.time,
          status: MessageStatus.sending,
          inReplyTo: message?.inReplyTo || null,
        })
      }
      else {
        delete inReplyTos[toValue(username)]

        // Push predicted user message
        historyClient.pushMessage({
          id: historyQueryUtils.predictMessageId.value,
          from: 'user',
          correctedMessage: [],
          content: message.content,
          time: message.time,
          status: MessageStatus.sending,
          inReplyTo: message?.inReplyTo || null,
        })
      }

      chatClient.setLastMessage({
        content: message.content,
        time: message.time,
        status: MessageStatus.sending,
      })
    },
    onError: async (e: unknown, message: MessageSend) => {
      const error = e as FetchError
      const errorStatus = error.response?.status

      if (errorStatus === RATE_LIMIT_STATUS_CODE) {
        toast.error(t('You are sending messages too fast. Please wait a moment.'))
      }

      if (errorStatus === PAYMENT_REQUIRED_STATUS_CODE) {
        isSubscriptionStatusModalOpen.value = true
      }

      historyClient.updateLastMessage({
        status: MessageStatus.error,
      })

      chatClient.setLastMessage({
        content: message.content,
        time: message.time,
        status: MessageStatus.error,
      })

      chatQueryUtils.updateInReplyToBeingLastMessage({
        content: message.content,
        status: MessageStatus.error,
      }, historyQuery.data.value)
    },
    onSuccess: (newHistory: History, message: MessageSend) => {
      historyClient.set(newHistory)

      const lastMessageFromHistory = newHistory[newHistory.length - 1]
      chatClient.setLastMessage({
        content: lastMessageFromHistory.content,
        time: lastMessageFromHistory.time,
        status: lastMessageFromHistory.status,
      })
      const userLastMessage = newHistory[newHistory.length - 2]

      const isRetrying = !!message.id
      if (isRetrying) {
        chatQueryUtils.updateInReplyToBeingLastMessage({
          content: userLastMessage.content,
          status: MessageStatus.seen,
          success: true,
        }, newHistory)
      }
    },
    onSettled: (_, __, message) => {
      const isRetrying = !!message.id

      if (isRetrying)
        return

      scrollBottom()
    },
  })

  const isError = computed(() => {
    if (sendMessageStatus.value === 'error') {
      return true
    }

    const lastMessageFromHistory = historyQueryUtils.lastMessage.value
    if (!lastMessageFromHistory)
      return false

    return lastMessageFromHistory.status === MessageStatus.error
  })

  const isSendMessageMutating = useIsMutating({
    mutationKey: queryKeys.messageSend(username),
  })

  function retryMutate() {
    sendMessageMutation.mutate({
      id: edition.messageId!, // It's the message id and it means retrying
      time: now().getTime(),
      content: edition.content!,
      inReplyTo: edition.inReplyTo,
    })

    edition.messageId = undefined
    edition.content = undefined
    edition.inReplyTo = undefined
  }

  return {
    mutate: sendMessageMutation.mutate,
    retryMutate,
    isPending: computed(() => isSendMessageMutating.value > 0),
    isError,
  }
}

export function useSendMessageMutationStatus(username: MaybeRef<string | null>) {
  const sendMessageStatuses = useMutationState({
    filters: { mutationKey: queryKeys.messageSend(username) },
    select: mutation => mutation.state.status,
  })

  return computed(() => sendMessageStatuses.value[sendMessageStatuses.value.length - 1])
}

export default useSendMessage
