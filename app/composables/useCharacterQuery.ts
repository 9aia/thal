import queryKeys from '~/queryKeys'

function useCharacterQuery(username: Ref<string>) {
  const localeWithDefaultRegion = useLocaleDefaultRegion()
  const characterNotFound = useState('characterNotFound', () => false)

  return useServerQuery(() => `/api/character/${username.value}` as `/api/character/:username`, {
    queryKey: queryKeys.character(localeWithDefaultRegion.value, username.value),
    query: () => ({
      locale: localeWithDefaultRegion.value,
    }),
    fetch: {
      onResponse({ response }) {
        if (response.status === 404) {
          characterNotFound.value = true
        }
      },
      ignoreResponseError: true,
    },
  })
}

export default useCharacterQuery
