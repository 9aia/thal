import { useQuery } from '@tanstack/vue-query'

export type Translation = ReturnType<typeof useTranslation>

export interface UseTranslation {
  message: MaybeRef<string>
  chatUsername?: MaybeRef<string>
  replyMessageId?: MaybeRef<number | undefined>
  toNative?: MaybeRef<boolean>
  refetchOnTranslate?: MaybeRef<boolean>
}

function useTranslation({ message, replyMessageId, chatUsername, toNative = true, refetchOnTranslate }: UseTranslation) {
  const open = ref(false)
  const enabled = ref(false)

  const translationQuery = useQuery({
    queryKey: ['message-translation', unref(message), unref(chatUsername), unref(toNative)],
    queryFn: async () => $fetch('/api/translate', {
      method: 'POST',
      body: {
        text: unref(message),
        chatUsername: unref(chatUsername),
        toNative: unref(toNative),
        replyMessageId: unref(replyMessageId),
      },
    }),
    enabled,
  })

  const toast = useToast()
  const { t } = useI18nExperimental()

  watch(translationQuery.error, (value) => {
    if (!value) {
      return
    }

    toast.error(t('Failed to translate message'))
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
    isError: translationQuery.isError,
    refetch: translationQuery.refetch,
    isLoading: computed(() => translationQuery.isLoading.value || translationQuery.isRefetching.value),
    onTranslate,
  }
}

export default useTranslation
