import { useQueryClient } from '@tanstack/vue-query'
import queryKeys from '~/queryKeys'

function useHistoryQuery(username: MaybeRef<string>) {
  const headers = useRequestHeaders(['cookie'])

  return useServerQuery({
    queryKey: queryKeys.history(username),
    queryFn: () => $fetch(`/api/chat/history/${toValue(username)}` as `/api/chat/history/:username`, {
      headers,
    }),
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
