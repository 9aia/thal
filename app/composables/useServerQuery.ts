import type { DefaultError, QueryClient, QueryKey, UseQueryOptions } from '@tanstack/vue-query'
import { useQuery } from '@tanstack/vue-query'
import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'
import type { SearchQueryParams } from '~/utils/types'

export type FetchOptions<R extends NitroFetchRequest> = Omit<NitroFetchOptions<R>, 'query'>

function useServerQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>,
  queryClient?: QueryClient,
) {
  const { suspense, ...rest } = useQuery({
    ...options,
  }, queryClient)

  onServerPrefetch(suspense)

  return rest
}

export default useServerQuery
