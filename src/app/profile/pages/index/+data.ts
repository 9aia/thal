import client from '#lib/hono/client'
import { render } from 'vike/abort'
import type { PageContext } from 'vike/types'
import type { Profile } from '../../schemas/profile'

export default async (c: PageContext) => {
  let profile: Profile | undefined

  const isMe = c.routeParams.isMe || c.routeParams.username === c.user?.username

  if (isMe) {
    profile = c.user!
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
