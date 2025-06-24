import type { Mutation } from '@tanstack/vue-query'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import queryKeys from '~/queryKeys'
import { edition, inReplyTos } from '~/store'

export default function useClearHistoryMutation(username: MaybeRef<string>) {
  const toast = useToast()
  const { t } = useI18nExperimental()
  const { updateScrollable } = useChatMainScroll()
  const queryClient = useQueryClient()
  const historyClient = useHistoryClient(username)
  const chatClient = useChatClient(username)

  return useMutation({
    mutationFn: async () => {
      const _username = toValue(username)

      toast.info(t('Clearing chat...'))

      // TODO: clear history on client only if the history has only one message and it's an error message

      return await $fetch(`/api/chat/history/${_username}`, { method: 'DELETE' })
    },
    onError: () => {
      toast.error(t('Failed to clear chat'))
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

      toast.success(t('Chat has been cleared'))

      updateScrollable()
    },
  })
}
