import { useQueryClient } from '@tanstack/vue-query'
import queryKeys from '~/queryKeys'

function useHistoryQuery(username: MaybeRef<string>) {
  const headers = useRequestHeaders(['cookie'])

  const sendMessageMutationStatus = useSendMessageMutationStatus(username)

  return useServerQuery({
    queryKey: queryKeys.history(username),
    queryFn: () => $fetch(`/api/chat/history/${toValue(username)}` as any as `/api/chat/history/:username`, {
      headers,
    }),
    staleTime: () => sendMessageMutationStatus.value === 'error' ? Infinity : 5000,
  })
}

export function prefetchHistoryQuery(username: MaybeRef<string>) {
  const headers = useRequestHeaders(['cookie'])

  const queryClient = useQueryClient()
  queryClient.prefetchQuery({
    queryKey: queryKeys.history(username),
    queryFn: () => $fetch(`/api/chat/history/${toValue(username)}` as `/api/chat/history/:username`, {
      headers,
    }),
  })
}

export function useHistoryQueryUtils(username: MaybeRef<string>) {
  const historyQuery = useHistoryQuery(username)

  const lastMessage = computed(() => {
    if (!historyQuery.data.value || historyQuery.data.value.length === 0) {
      return null
    }

    return historyQuery.data.value[historyQuery.data.value.length - 1]
  })

  const predictMessageId = computed(() => {
    if (!historyQuery.data.value || historyQuery.data.value.length === 0) {
      return 1
    }
    return historyQuery.data.value.length + 1
  })

  return {
    lastMessage,
    predictMessageId,
  }
}

export default useHistoryQuery
