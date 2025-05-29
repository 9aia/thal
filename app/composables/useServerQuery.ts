import type { DefaultError, QueryClient, QueryKey, UseQueryOptions } from '@tanstack/vue-query'
import { useQuery } from '@tanstack/vue-query'
import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'
import type { SearchQueryParams } from '~/utils/types'

export type FetchOptions<R extends NitroFetchRequest> = Omit<NitroFetchOptions<R>, 'query'>

/**
 * A composable that wraps useQuery to enable server-side data prefetching with Vue Query.
 *
 * This composable leverages Vue Query's server-side prefetching capabilities to:
 * 1. Prefetch data on the server during SSR
 * 2. Dehydrate the queries to the queryClient
 * 3. Hydrate the queries on the client once JavaScript is available
 *
 * The prefetched data is immediately available on page load, and Vue Query will
 * automatically handle refetching if the data becomes stale since server rendering.
 *
 * Features:
 * - Automatically passes request headers to $fetch
 * - Supports dynamic search query params through the query option
 * - Handles both function and direct request objects
 *
 * @param request - NitroFetchRequest to fetch data from the server. Can be a function or direct NitroFetchRequest.
 * @param options - Configuration options including:
 *   - query: Optional search query params for the request (can be function or object)
 *   - Additional Vue Query options (queryKey, staleTime, etc.)
 * @param queryClient - Optional QueryClient instance to use
 * @returns The query result with prefetched data. Returns the same as useQuery
 *
 * @example
 * ```ts
 * // With static search query params
 * const { data } = useServerQuery('/api/users', {
 *   query: { limit: 10 },
 *   queryKey: ['users']
 * })
 *
 * // With dynamic search query params
 * const { data } = useServerQuery('/api/users', {
 *   query: () => ({ limit: pageSize.value }),
 *   queryKey: ['users', pageSize]
 * })
 * ```
 */
function useServerQuery<
  DefaultR extends NitroFetchRequest = NitroFetchRequest,
  R extends NitroFetchRequest = DefaultR,
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  request: (() => R) | R,
  options: {
    query?: (() => SearchQueryParams) | SearchQueryParams
    fetch?: FetchOptions<R>
  } & UseQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>,
  queryClient?: QueryClient,
) {
  const headers = useRequestHeaders()
  const { query, fetch: fetchOptions = {}, ...restOptions } = options

  const fetcher = () => $fetch(typeof request === 'function' ? request() : request, {
    headers,
    query: typeof query === 'function' ? query() : query,
    ...fetchOptions,
  })

  const { suspense, ...rest } = useQuery({
    ...restOptions,
    queryFn: fetcher as any,
  }, queryClient)

  onServerPrefetch(suspense)

  return rest as Omit<typeof rest, 'data'> & {
    data: Ref<Readonly<Awaited<ReturnType<typeof fetcher>>>>
  }
}

export default useServerQuery
