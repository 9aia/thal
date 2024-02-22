import type { CfProperties } from '@cloudflare/workers-types'
import type { PageContext } from 'vike/types'
import client from '#lib/hono/client'
import { getFetchWithCookies } from '#lib/hono/utils/getFetchWithCookies'

export default async function (pageContext: PageContext) {
  const res = await client.auth['verify-login'].$get(undefined, {
    fetch: getFetchWithCookies(pageContext),
  })

  const data = await res.json()

  return data
}
