import { useQuery } from '@tanstack/vue-query'
import queryKeys from '~/queryKeys'

export function useReceiverUsernameNotFound() {
  return useState<boolean>('receiverUsernameNotFound', () => false)
}

function useCharacterFetchFn(username?: MaybeRef<string | null>) {
  const receiverUsernameNotFound = useReceiverUsernameNotFound()
  const headers = useRequestHeaders(['cookie'])
  const localeWithDefaultRegion = useLocaleWithDefaultRegion()

  return () => $fetch(`/api/character/${toValue(username)}` as `/api/character/:username`, {
    params: {
      locale: localeWithDefaultRegion.value,
    },
    headers,
    onResponse({ response }) {
      if (response.status === 404) {
        receiverUsernameNotFound.value = true
      }
    },
    ignoreResponseError: true,
  })
}

function useCharacterQuery(username?: MaybeRef<string | null>) {
  const localeWithDefaultRegion = useLocaleWithDefaultRegion()
  const fetchFn = useCharacterFetchFn(username)

  const isQueryEnabled = computed(() => !!unref(username))

  const {
    suspense,
    ...query
  } = useQuery({
    queryKey: queryKeys.character(localeWithDefaultRegion.value, toValue(username!)),
    queryFn: fetchFn,
    enabled: isQueryEnabled,
  })

  if (isQueryEnabled.value) {
    onServerPrefetch(suspense)
  }

  return query
}

export default useCharacterQuery
