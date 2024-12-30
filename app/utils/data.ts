import type { InfiniteData } from "@tanstack/vue-query"
import type { Pagination } from "~~/layers/ui/schemas/paginator.schema"

export function getBase64(file: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

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
>(data: InfiniteData<T>): InfiniteData<T["data"][number]> {
  return {
    ...data,
    pages: data.pages?.flatMap((page: typeof data.pages[number]) => page.data),
  }
}

export function swapToFirst<T>(arr: T[], from: number) {
  if (from <= 0 || from >= arr.length)
    return arr

  const fromItem = arr[from]
  const arrCopy = [fromItem]

  for (let i = 0; i < arr.length; i++) {
    if (i === from)
      continue

    arrCopy.push(arr[i])
  }

  return arrCopy
}
