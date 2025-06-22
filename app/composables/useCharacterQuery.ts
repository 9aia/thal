import queryKeys from '~/queryKeys'

export function useReceiverUsernameNotFound() {
  return useState<boolean>('receiverUsernameNotFound', () => false)
}

function useCharacterFetchFn(username: MaybeRef<string>) {
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

function useCharacterQuery(username: MaybeRef<string>) {
  const localeWithDefaultRegion = useLocaleWithDefaultRegion()
  const fetchFn = useCharacterFetchFn(username)

  return useServerQuery({
    queryKey: queryKeys.character(localeWithDefaultRegion.value, toValue(username)),
    queryFn: fetchFn,
  })
}

export default useCharacterQuery
