import { redirect } from 'vike/abort'
import type { PageContext } from 'vike/types'
import { parseCookies } from '#lib/web/utils/cookies'

export default (pageContext: PageContext) => {
  const cookies = parseCookies(pageContext.cookies)
  const username = cookies.username

  throw redirect(`/app/profile/${username}`)
}
