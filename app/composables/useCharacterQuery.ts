import queryKeys from '~/queryKeys'

function useCharacterQuery(username: Ref<string>) {
  const localeWithDefaultRegion = useLocaleDefaultRegion()
  const characterNotFound = useState('characterNotFound', () => false)

  return useServerQuery({
    queryKey: queryKeys.character(localeWithDefaultRegion.value, username.value),
    queryFn: () => serverFetch(`/api/character/${username.value}` as `/api/character/:username`, {
      params: {
        locale: localeWithDefaultRegion.value,
      },
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
