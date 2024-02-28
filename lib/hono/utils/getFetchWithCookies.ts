export function getFetchWithCookies(cookies: string) {
  return (input: string | Request | URL, requestInit?: RequestInit<CfProperties<unknown>>) => {
    return fetch(input, {
      ...requestInit,
      headers: {
        Cookie: cookies,
      },
    })
  }
}
