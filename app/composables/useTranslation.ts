import { useQuery } from '@tanstack/vue-query'

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
    queryKey: [_queryKey, toValue(message), toValue(chatUsername), toValue(toNative)],
    queryFn: async () => $fetch('/api/translate', {
      method: 'POST',
      body: {
        messageText: toValue(message),
        messageIsBot: toValue(messageIsBot),
        chatUsername: toValue(chatUsername),
        toNative: toValue(toNative),
        replyMessageId: toValue(replyMessageId),
      },
    }),
    enabled,
  })

  const onTranslate = () => {
    open.value = !open.value

    enabled.value && toValue(refetchOnTranslate)
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
