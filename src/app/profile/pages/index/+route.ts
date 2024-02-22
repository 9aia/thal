import type { PageContext } from 'vike/types'
import { resolveRoute } from 'vike/routing'

export default (c: PageContext) => {
  const result = resolveRoute('/app/profile/@username', c.urlPathname)

  if (result.match)
    return result

  const result2 = resolveRoute('/app/profile', c.urlPathname)

  if (result2.match) {
    result2.routeParams = { username: 'me', isMe: 'true' }

    return result2
  }

  return false
}
