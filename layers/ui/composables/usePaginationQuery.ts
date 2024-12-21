import { useInfiniteQuery } from "@tanstack/vue-query"

export type QueryKey = Parameters<typeof useInfiniteQuery>[0]["queryKey"]

export interface UseInfiniteQueryFnPayload {
  params: {
    page: number
    perPage: number
  }
}

export interface UseInfiniteQueryOptions<T> {
  queryKey: QueryKey
  queryFn: (payload: UseInfiniteQueryFnPayload) => T
  page?: number
  perPage?: number
  initialPageParam?: number
}

/**
 * @warning Ensure your endpoint supports pagination before using this composable.
 * This composable assumes the endpoint provides paginated responses with parameters like
 * `page` and `perPage` and includes a `nextPage` field in the response for fetching
 * subsequent pages. Using this composable with non-paginated endpoints may result in
 * unexpected behavior or errors.
 */
export function usePaginationQuery<
  T extends Promise<{ data: any[] }>,
>(options: UseInfiniteQueryOptions<T>) {
  const query = useInfiniteQuery({
    queryKey: options.queryKey,
    queryFn: ({ pageParam }) => options.queryFn({
      params: {
        page: pageParam,
        perPage: options.perPage ?? 10,
      },
    }),
    initialPageParam: options.initialPageParam ?? 1,
    getNextPageParam: lastPage => (lastPage as any).nextPage,
    select: data => unwrapInfiniteData(data),
  })

  return query
}
