import { useI18n } from '@psitta/vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import queryKeys from '~/queryKeys'

export default function useClearChat(username: MaybeRef<string | undefined>) {
  const queryClient = useQueryClient()
  const toast = useToast()
  const { t } = useI18n()

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
      const _username = unref(username)

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
