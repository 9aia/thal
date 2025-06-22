import { useQueryClient } from '@tanstack/vue-query'
import queryKeys from '~/queryKeys'

export function useReceiverUsernameNotFound() {
  return useState<boolean>('receiverUsernameNotFound', () => false)
}

function useCharacterFetchFn(username: MaybeRef<string>) {
  const receiverUsernameNotFound = useReceiverUsernameNotFound()
  const headers = useRequestHeaders(['cookie'])
  const localeWithDefaultRegion = useLocaleDefaultRegion()

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

function useCharacterQuery(username: MaybeRef<string>) {
  const localeWithDefaultRegion = useLocaleDefaultRegion()
  const fetchFn = useCharacterFetchFn(username)

  return useServerQuery({
    queryKey: queryKeys.character(localeWithDefaultRegion.value, toValue(username)),
    queryFn: fetchFn,
  })
}

export default useCharacterQuery
