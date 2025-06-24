import { useMutation, useQueryClient } from '@tanstack/vue-query'
import queryKeys from '~/queryKeys'

export default function useClearHistoryMutation(username: MaybeRefOrGetter<string | undefined>) {
  const queryClient = useQueryClient()
  const toast = useToast()
  const { t } = useI18nExperimental()
  const { updateScrollable } = useChatMainScroll()

  return useMutation({
    mutationFn: async () => {
      const _username = toValue(username)

      toast.info(t('Clearing chat...'))

      return await $fetch(`/api/chat/history/${_username}`, { method: 'DELETE' })
    },
    onError: () => {
      toast.error(t('Failed to clear chat'))
    },
    onSuccess: () => {
      const _username = toValue(username) as string

      queryClient.setQueryData(queryKeys.history(_username), [])

      // TODO: HIGH: remove the LastMessage from the chat using setQueryData

      toast.success(t('Chat has been cleared'))

      updateScrollable()
    },
  })
}
