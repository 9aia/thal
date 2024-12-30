import { useQuery } from "@tanstack/vue-query"

export type Translation = ReturnType<typeof useTranslation>

function useTranslation(message: MaybeRef<string>) {
  const open = ref(false)
  const enabled = ref(false)

  const translationQuery = useQuery({
    queryKey: ["message-translation", unref(message)],
    queryFn: async () => $fetch("/api/translate", {
      method: "POST",
      body: {
        text: unref(message),
        locale: "pt-br",
      },
    }),
    enabled,
  })

  const onTranslate = () => {
    enabled.value = true
    open.value = true
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
    isLoading: translationQuery.isLoading,
    onTranslate,
  }
}

export default useTranslation
