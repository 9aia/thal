import { useQueryClient } from '@tanstack/vue-query'
import queryKeys from '~/queryKeys'

function useContactQuery(username: MaybeRef<string>) {
  const headers = useRequestHeaders(['cookie'])

  return useServerQuery({
    queryKey: queryKeys.contact(username),
    queryFn: () => $fetch(`/api/contact/${toValue(username)}` as `/api/contact/:username`, {
      headers,
    }),
  })
}

export function prefetchContactQuery(username: MaybeRef<string>) {
  const headers = useRequestHeaders(['cookie'])

  const queryClient = useQueryClient()
  queryClient.prefetchQuery({
    queryKey: queryKeys.contact(username),
    queryFn: () => $fetch(`/api/contact/${toValue(username)}` as `/api/contact/:username`, {
      headers,
    }),
  })
}

export default useContactQuery
