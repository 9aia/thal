import type { PageContext } from 'vike/types'
import { resolveRoute } from 'vike/routing'

export default (pageContext: PageContext) => {
  const result = resolveRoute('/app/profile/@username', pageContext.urlPathname)

  if (result.match)
    return result

  const result2 = resolveRoute('/app/profile', pageContext.urlPathname)

  if (result2.match) {
    result2.routeParams = { username: 'me', isMe: 'true' }

    return result2
  }

  return false
}
