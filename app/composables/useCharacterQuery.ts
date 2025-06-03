import queryKeys from '~/queryKeys'

function useCharacterQuery(username: Ref<string>) {
  const localeWithDefaultRegion = useLocaleDefaultRegion()
  const characterNotFound = useState('characterNotFound', () => false)
  const headers = useRequestHeaders(['cookie'])

  return useServerQuery({
    queryKey: queryKeys.character(localeWithDefaultRegion.value, username.value),
    queryFn: () => $fetch(`/api/character/${username.value}`, {
      params: {
        locale: localeWithDefaultRegion.value,
      },
      headers,
      onResponse({ response }) {
        if (response.status === 404) {
          characterNotFound.value = true
        }
      },
      ignoreResponseError: true,
    }),
  })
}

export default useCharacterQuery
