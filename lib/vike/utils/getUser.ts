import client from '#lib/hono/client'
import { getFetchWithCookies } from '#lib/hono/utils/getFetchWithCookies'

async function getUser(cookies: string) {
  const res = await client.app.profile.logged.$get({
    fetch: getFetchWithCookies(cookies),
  })

  if (res.ok) {
    const user = await res.json()
    return user
  }

  return null
}

export default getUser
