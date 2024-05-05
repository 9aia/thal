import type { Session, User } from "lucia"
import { verifyRequestOrigin } from "lucia"
import { initializeLucia } from "../utils/auth"

let lucia: ReturnType<typeof initializeLucia>

export default defineEventHandler(async (event) => {
  // CSRF protection
  if (!isMethod(event, "GET") && !import.meta.dev) {
    const originHeader = getHeader(event, "Origin") ?? null
    const hostHeader = getHeader(event, "Host") ?? null
    if (
      !originHeader
      || !hostHeader
      || !verifyRequestOrigin(originHeader, [hostHeader])
    )
      return sendNoContent(event, 403)
  }

  const { DB } = event.context.cloudflare.env

  if (!lucia)
    lucia = initializeLucia(DB)

  event.context.lucia = lucia

  const sessionId = getCookie(event, lucia.sessionCookieName) ?? null

  if (!sessionId) {
    event.context.session = null
    event.context.user = null
    return
  }

  const { session, user } = await lucia.validateSession(sessionId)

  if (session && session.fresh) {
    appendResponseHeader(
      event,
      "Set-Cookie",
      lucia.createSessionCookie(session.id).serialize(),
    )
  }

  if (!session) {
    appendResponseHeader(
      event,
      "Set-Cookie",
      lucia.createBlankSessionCookie().serialize(),
    )
  }

  event.context.session = session
  event.context.user = user
})

declare module "h3" {
  interface H3EventContext {
    user: User | null
    session: Session | null
    lucia: ReturnType<typeof initializeLucia>
  }
}
