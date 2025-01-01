import type { DefaultError, QueryClient, QueryKey, UseQueryOptions } from '@tanstack/vue-query'
import { useQuery } from '@tanstack/vue-query'
import type { NitroFetchRequest } from 'nitropack'
import type { Params } from '~/utils/types'

async function useServerQuery<
  DefaultR extends NitroFetchRequest = NitroFetchRequest,
  R extends NitroFetchRequest = DefaultR,
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  request: (() => R) | R,
  options: {
    params?: (() => Params) | Params
  } & UseQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>,
  queryClient?: QueryClient,
) {
  const headers = useRequestHeaders()
  const { params, ...restOptions } = options

  const fetcher = () => $fetch(typeof request === 'function' ? request() : request, {
    headers,
    params: typeof params === 'function' ? params() : params,
  })

  const { suspense, ...rest } = useQuery({
    ...restOptions,
    queryFn: fetcher as any,
  }, queryClient)

  onServerPrefetch(async () => await suspense())

  return rest as Omit<typeof rest, 'data'> & {
    data: Ref<Readonly<Awaited<ReturnType<typeof fetcher>>>>
  }
}

export default useServerQuery
