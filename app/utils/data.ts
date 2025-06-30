import type { InfiniteData } from '@tanstack/vue-query'
import type { Pagination } from '~/schemas/data'

export function calculatePagination<T extends Pagination>(query: T) {
  const { page, perPage } = query

  const offset = (page - 1) * perPage
  const limit = perPage

  return {
    offset,
    limit,
  }
}

export function getPaginatedDto<T extends Array<D>, D>(query: Pagination, result: T) {
  return {
    page: query.page,
    perPage: query.perPage,
    data: result,
    nextPage: result.length ? query.page + 1 : undefined,
  }
}

export function unwrapInfiniteData<
  T extends { data: any[] },
>(data: InfiniteData<T>): InfiniteData<T['data'][number]> {
  return {
    ...data,
    pages: data.pages?.flatMap((page: typeof data.pages[number]) => page.data),
  }
}
