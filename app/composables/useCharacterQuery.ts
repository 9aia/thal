import { useQuery } from '@tanstack/vue-query'
import queryKeys from '~/queryKeys'

export function useCharacterFetchFn(username?: MaybeRef<string | null>) {
  const headers = useRequestHeaders(['cookie'])
  const localeWithDefaultRegion = useLocaleWithDefaultRegion()

  return () => $fetch(`/api/character/${toValue(username)}` as `/api/character/:username`, {
    params: {
      locale: localeWithDefaultRegion.value,
    },
    headers,
  })
}

function useCharacterQuery(username?: MaybeRef<string | null>, options?: { initialData?: any }) {
  const localeWithDefaultRegion = useLocaleWithDefaultRegion()
  const fetchFn = useCharacterFetchFn(username)

  const isQueryEnabled = computed(() => !!unref(username))

  const query = useQuery({
    queryKey: queryKeys.character(localeWithDefaultRegion.value, toValue(username!)),
    queryFn: fetchFn,
    enabled: isQueryEnabled,
    initialData: options?.initialData,
  })

  return query
}

export default useCharacterQuery
