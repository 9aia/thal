import { useQuery } from '@tanstack/vue-query'
import queryKeys from '~/queryKeys'
import { chatListSearch } from '~/store'

function useChatsQuery() {
  const localWithDefaultRegion = useLocaleWithDefaultRegion()
  const headers = useRequestHeaders(['cookie'])

  return useQuery({
    queryKey: queryKeys.chatsSearch(localWithDefaultRegion.value, chatListSearch),
    queryFn: () => $fetch('/api/chat', {
      params: {
        search: chatListSearch.value,
        locale: localWithDefaultRegion.value,
      },
      headers,
    }),
  })
}

export default useChatsQuery
