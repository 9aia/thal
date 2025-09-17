import type { InfiniteData } from '@tanstack/vue-query'

export function unwrapInfiniteData<
  T extends { data: any[] },
>(data: InfiniteData<T>): InfiniteData<T['data'][number]> {
  return {
    ...data,
    pages: data.pages?.flatMap((page: typeof data.pages[number]) => page.data),
  }
}
