import type { Mutation } from '@tanstack/vue-query'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import queryKeys from '~/queryKeys'
import { edition, inReplyTos } from '~/store'
import { MessageStatus } from '~~/db/schema'

export default function useClearHistoryMutation(username: MaybeRef<string>, options?: {
  onSuccess?: () => void
  onError?: () => void
}) {
  const toast = useToast()
  const { t } = useI18nExperimental()
  const { updateScrollable } = useChatMainScroll()
  const queryClient = useQueryClient()
  const historyQuery = useHistoryQuery(username)
  const historyClient = useHistoryClient(username)
  const chatClient = useChatClient(username)

  return useMutation({
    mutationFn: async () => {
      const _username = toValue(username)

      toast.info(t('Clearing chat...'))

      // Clear history on client only if the history has only one message and it's an error message
      const history = historyQuery.data.value || []

      if (history.length === 1 && history[0]?.status === MessageStatus.error) {
        historyClient.clear()
        chatClient.deleteLastMessage()
        return history
      }

      return await $fetch(`/api/chat/history/${_username}`, { method: 'DELETE' })
    },
    onError: () => {
      toast.error(t('An error occurred while clearing chat history.'))

      options?.onError?.()
    },
    onSuccess: () => {
      const _username = toValue(username) as string

      historyClient.clear()
      chatClient.deleteLastMessage()

      // Exit edition
      edition.messageId = undefined
      edition.content = ''
      edition.inReplyTo = undefined

      // Reset inReplyTo
      delete inReplyTos[_username]

      // Reset sendMessage cache mutations
      const mutations = queryClient.getMutationCache().findAll({
        status: 'error',
        mutationKey: queryKeys.messageSend(username),
      })

      mutations.forEach((mutation: Mutation) => {
        queryClient.getMutationCache().remove(mutation)
      })

      toast.success(t('Chat history has been cleared.'))

      updateScrollable()

      options?.onSuccess?.()
    },
  })
}
