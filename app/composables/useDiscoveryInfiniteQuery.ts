import { useInfiniteQuery } from '@tanstack/vue-query'
import queryKeys from '~/queryKeys'

function useDiscoveryInfiniteQuery(search: MaybeRef<string>, categoryId: MaybeRef<number | undefined>) {
  const localeWithDefaultRegion = useLocaleWithDefaultRegion()
  const headers = useRequestHeaders(['cookie'])

  const query = useInfiniteQuery({
    queryKey: queryKeys.discoverCharactersSearch(localeWithDefaultRegion, search, categoryId),
    queryFn: ({ pageParam }) => $fetch('/api/character/discover', {
      query: {
        page: pageParam,
        perPage: 10,
      },
      params: {
        search: toValue(search),
        categoryId: toValue(categoryId),
        locale: localeWithDefaultRegion.value,
      },
      headers,
    }),
    initialPageParam: 1,
    getNextPageParam: lastPage => (lastPage as any).nextPage,
    select: data => unwrapInfiniteData(data),
  })
  onServerPrefetch(query.suspense)

  return query
}

export default useDiscoveryInfiniteQuery
