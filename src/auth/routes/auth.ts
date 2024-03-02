import { Hono } from 'hono'
import { deleteCookie, getCookie } from 'hono/cookie'
import type { HonoContext } from '#lib/hono/types'
import { unauthorized } from '#lib/hono/utils/httpStatus'

const authRouter = new Hono<HonoContext>()

export default authRouter
  .post('/logout', async (c) => {
    const auth = c.get('auth')

    const sessionId = getCookie(c, 'auth_session')

    if (!sessionId)
      throw unauthorized()

    const session = await auth.lucia.getSession(sessionId)

    if (!session)
      throw unauthorized()

    await auth.lucia.invalidateSession(sessionId)
    deleteCookie(c, 'auth_session')
    deleteCookie(c, 'google_oauth_state')

    return c.redirect('/authentication')
  })
