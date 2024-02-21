import type { CfProperties } from '@cloudflare/workers-types'
import type { PageContext } from 'vike/types'
import client from '#lib/hono/client'

export default async function (ctx: PageContext) {
  const res = await client.auth['verify-login'].$get(undefined, {
    fetch(input: string | Request | URL, requestInit?: RequestInit<CfProperties<unknown>>) {
      return fetch(input, {
        ...requestInit,
        headers: {
          Cookie: ctx.cookies,
        },
      })
    },
  })

  const data = await res.json()

  return data
}
