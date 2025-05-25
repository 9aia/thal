import { setSessionTokenCookie, validateSessionToken } from '../services/auth'
import type { Session, User } from '~~/db/schema'

export default defineEventHandler(async (event) => {
  if (event.path === '/api/payment/webhook/stripe') {
    return
  }

  if (!isMethod(event, 'GET')) {
    const originHeader = getHeader(event, 'Origin') ?? null
    const hostHeader = getHeader(event, 'Host') ?? null

    if (originHeader === null || hostHeader === null) {
      return sendNoContent(event, 403)
    }

    const originUrl = new URL(originHeader.startsWith('http') ? originHeader : `http://${originHeader}`)
    const hostUrl = new URL(hostHeader.startsWith('http') ? hostHeader : `http://${hostHeader}`)

    if (originUrl.host !== hostUrl.host)
      return sendNoContent(event, 403)
  }

  const orm = event.context.orm

  const token = getCookie(event, 'session') ?? null

  if (token === null) {
    event.context.session = null
    event.context.user = null
    return
  }

  const { session, user } = await validateSessionToken(orm, token)

  if (session === null) {
    event.context.session = null
    event.context.user = null
    return
  }

  setSessionTokenCookie(event, token, session.expiresAt)

  event.context.session = session
  event.context.user = user
})

declare module 'h3' {
  interface H3EventContext {
    user: User | null
    session: Session | null
  }
}
