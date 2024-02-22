import type { CfProperties } from '@cloudflare/workers-types'
import type { PageContext } from 'vike/types'
import client from '#lib/hono/client'
import { getFetchWithCookies } from '#lib/hono/utils/getFetchWithCookies'

export default async function (c: PageContext) {
  const res = await client.auth['verify-login'].$get(undefined, {
    fetch: getFetchWithCookies(c),
  })

  const data = await res.json()

  return data
}
