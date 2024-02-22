import type { PageContext } from 'vike/types'

export function getFetchWithCookies(c: PageContext) {
  return (input: string | Request | URL, requestInit?: RequestInit<CfProperties<unknown>>) => {
    return fetch(input, {
      ...requestInit,
      headers: {
        Cookie: c.cookies,
      },
    })
  }
}
