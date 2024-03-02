import client from '#lib/hono/client'
import { render } from 'vike/abort'
import type { PageContext } from 'vike/types'
import type { User } from '../../schemas/user'

export default async (c: PageContext) => {
  let user: User | undefined

  const isMe = c.routeParams.isMe || c.routeParams.username === c.user?.username

  if (isMe) {
    user = c.user!
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
        404: `User not found: ${username}`,
      }
      const message
        = messages[res.status] || `Error fetching user data: ${username}`

      throw render(res.status as any, message)
    }

    user = await res.json()
  }

  return user
}
