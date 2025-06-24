import { useMutationState, useQueryClient } from '@tanstack/vue-query'
import queryKeys from '~/queryKeys'

function useSendMessageMutationStatus(username: MaybeRef<string>) {
  const sendMessageStatuses = useMutationState({
    filters: { mutationKey: queryKeys.messageSend(username) },
    select: mutation => mutation.state.status,
  })
  const latestSendMessageMutationStatus = sendMessageStatuses.value[sendMessageStatuses.value.length - 1]
  return latestSendMessageMutationStatus
}

function useHistoryQuery(username: MaybeRef<string>) {
  const headers = useRequestHeaders(['cookie'])

  const sendMessageMutationStatus = useSendMessageMutationStatus(username)

  return useServerQuery({
    queryKey: queryKeys.history(username),
    queryFn: () => $fetch(`/api/chat/history/${toValue(username)}` as any as `/api/chat/history/:username`, {
      headers,
    }),
    staleTime: () => sendMessageMutationStatus === 'error' ? Infinity : 5000,
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

export default useHistoryQuery
