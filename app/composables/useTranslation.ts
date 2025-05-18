import { useQuery } from '@tanstack/vue-query'
import type { FetchError } from 'ofetch'

export type Translation = ReturnType<typeof useTranslation>

export interface UseTranslation {
  queryKey: string
  message: MaybeRef<string>
  messageIsBot: MaybeRef<boolean>
  chatUsername?: MaybeRef<string>
  replyMessageId?: MaybeRef<number | undefined>
  toNative?: MaybeRef<boolean>
  refetchOnTranslate?: MaybeRef<boolean>
}

function useTranslation({ messageIsBot, message, replyMessageId, chatUsername, toNative = true, refetchOnTranslate, queryKey }: UseTranslation) {
  const open = ref(false)
  const enabled = ref(false)
  const _queryKey = queryKey || 'message-translation'

  const translationQuery = useQuery({
    queryKey: [_queryKey, unref(message), unref(chatUsername), unref(toNative)],
    queryFn: async () => $fetch('/api/translate', {
      method: 'POST',
      body: {
        messageText: unref(message),
        messageIsBot: unref(messageIsBot),
        chatUsername: unref(chatUsername),
        toNative: unref(toNative),
        replyMessageId: unref(replyMessageId),
      },
    }),
    enabled,
  })

  const onTranslate = () => {
    open.value = true

    enabled.value && unref(refetchOnTranslate)
      ? translationQuery.refetch()
      : enabled.value = true
  }

  watch(translationQuery.isError, (value) => {
    if (!value)
      return

    enabled.value = false
  })

  watch(translationQuery.data, (value) => {
    if (!value)
      return

    open.value = true
  })
  const translation = computed(() => translationQuery.data.value?.translation)

  return {
    translation,
    isOpen: open,
    error: translationQuery.error,
    isError: translationQuery.isError,
    refetch: translationQuery.refetch,
    isLoading: computed(() => translationQuery.isLoading.value || translationQuery.isRefetching.value),
    onTranslate,
  }
}

export default useTranslation
