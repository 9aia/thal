import { useQuery, useQueryClient } from '@tanstack/vue-query'
import queryKeys from '~/queryKeys'

function useContactQuery(username?: MaybeRef<string | null>) {
  const headers = useRequestHeaders(['cookie'])

  const isQueryEnabled = computed(() => !!unref(username))

  const {
    suspense,
    ...query
  } = useQuery({
    queryKey: queryKeys.contact(username!),
    queryFn: () => $fetch(`/api/contact/${toValue(username)}` as `/api/contact/:username`, {
      headers,
    }),
    enabled: isQueryEnabled,
  })

  if (isQueryEnabled.value) {
    onServerPrefetch(suspense)
  }

  return query
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
