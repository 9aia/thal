import client from '#lib/hono/client'
import { getFetchWithCookies } from '#lib/hono/utils/getFetchWithCookies'
import type { PageContext } from 'vike/types'

export default async function (c: PageContext) {
  const res = await client.auth['verify-login'].$get(undefined, {
    fetch: getFetchWithCookies(c),
  })

  const data = await res.json()

  return data
}
