import type { PageContext } from 'vike/types'
import { render } from 'vike/abort'
import client from '#lib/hono/client'
import type { Profile } from '../../schemas/profile'
import { getFetchWithCookies } from '#lib/hono/utils/getFetchWithCookies'

export default async (c: PageContext) => {
  let profile: Profile | undefined

  const isMe = c.routeParams.isMe
  if (isMe) {
    const res = await client.app.profile.logged.$get(undefined, {
      fetch: getFetchWithCookies(c),
    })

    const data = await res.json()

    if (!res.ok) {
      const messages: Record<number, string> = {
        404: `No profile found for the logged in user`,
      }
      const message
        = messages[res.status] || `Error fetching profile data for the logged in user`

      throw render(res.status as any, message)
    }

    profile = data
  }
  else {
    const username = c.routeParams.username

    const res = await client.app.profile[':username'].$get({
      param: {
        username,
      },
    })

    if (!res.ok) {
      const messages: Record<number, string> = {
        404: `Profile not found: ${username}`,
      }
      const message
        = messages[res.status] || `Error fetching profile data: ${username}`

      throw render(res.status as any, message)
    }

    profile = await res.json()
  }

  return profile
}
