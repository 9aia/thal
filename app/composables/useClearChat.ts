import { useMutation, useQueryClient } from '@tanstack/vue-query'
import queryKeys from '~/queryKeys'

export default function useClearChat(username: MaybeRefOrGetter<string | undefined>) {
  const queryClient = useQueryClient()
  const toast = useToast()
  const { t } = useI18nExperimental()

  const {
    mutate,
  } = useMutation({
    mutationFn: async () => {
      const _username = unref(username)

      return await $fetch(`/api/chat/history/${_username}`, { method: 'DELETE' })
    },
    onError: () => {
      toast.error(t('Failed to clear chat'))
    },
    onSuccess: () => {
      const _username = toValue(username) as string

      queryClient.setQueryData(queryKeys.chatHistory(_username), [])

      toast.success(t('Chat has been cleared'))

      queryClient.invalidateQueries({
        queryKey: queryKeys.chat(_username),
      })

      queryClient.invalidateQueries({
        queryKey: queryKeys.chats,
      })
    },
  })

  return mutate
}
