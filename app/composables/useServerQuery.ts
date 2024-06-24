import type { DefaultError, QueryClient, QueryKey, UseQueryOptions } from "@tanstack/vue-query"
import { useQuery } from "@tanstack/vue-query"
import type { NitroFetchRequest } from "nitropack"
import { readonly } from "vue"

async function useServerQuery<
  DefaultR extends NitroFetchRequest = NitroFetchRequest,
  R extends NitroFetchRequest = DefaultR,
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  request: R,
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryFnData, TQueryKey>,
  queryClient?: QueryClient,
) {
  const headers = useRequestHeaders()

  const fetcher = () => $fetch(request, {
    headers,
  })

  const { suspense, ...rest } = useQuery({
    ...options,
    queryFn: fetcher as any,
  }, queryClient)

  onServerPrefetch(async () => await suspense())

  return rest as Omit<typeof rest, "data"> & {
    data: Ref<Readonly<Awaited<ReturnType<typeof fetcher>>>>
  }
}

export default useServerQuery
