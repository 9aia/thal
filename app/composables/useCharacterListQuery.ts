import { useQuery } from '@tanstack/vue-query'
import queryKeys from '~/queryKeys'

export function useCharacterListFetchFn() {
  const headers = useRequestHeaders(['cookie'])
  const localeWithDefaultRegion = useLocaleWithDefaultRegion()

  return () => $fetch('/api/character', {
    params: {
      locale: localeWithDefaultRegion.value,
    },
    headers,
  })
}

export function useCharacterListQuery(options?: { initialData?: any }) {
  const fetchFn = useCharacterListFetchFn()

  const query = useQuery({
    queryKey: queryKeys.myCharacters,
    queryFn: fetchFn,
    initialData: options?.initialData,
  })

  return query
}
