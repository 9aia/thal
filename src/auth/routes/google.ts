import { OAuthRequestError } from '@lucia-auth/oauth'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { env } from 'hono/adapter'
import { getCookie, setCookie } from 'hono/cookie'
import type { HonoContext } from '#lib/hono/types'
import { createProfile } from '~/app/profile/utils/getProfile'
import { users } from '~/auth/schemas/user'

export default new Hono<HonoContext>()
  .get('/google', async (c) => {
    const auth = c.get('auth')
    const { DEV } = env(c)

    const requestUrl = new URL(c.req.url)
    const type = requestUrl.searchParams.get('type') as 'pricing' | null

    const returnUrl = type === 'pricing'
      ? `/api/payment/stripe/create-checkout-session`
      : '/'

    const [url, state] = await auth.googleAuth.getAuthorizationUrl()

    setCookie(c, 'google_oauth_state', state, {
      httpOnly: true,
      secure: !DEV,
      path: '/',
      maxAge: 60 * 60,
    })

    setCookie(c, 'return_url', returnUrl)

    return c.redirect(url.toString())
  })
  .get('/google/callback', async (c) => {
    const auth = c.get('auth')
    const orm = c.get('orm')

    const storedState = getCookie(c, 'google_oauth_state')

    const returnUrl = getCookie(c, 'return_url') || '/'

    const url = new URL(c.req.url)
    const state = url.searchParams.get('state')
    const code = url.searchParams.get('code')

    if (!storedState || !state || storedState !== state || !code)
      return c.body(null, 400)

    try {
      const { getExistingUser, googleUser, createUser }
        = await auth.googleAuth.validateCallback(code)

      const getUser = async () => {
        const username = googleUser.email?.split('@')[0] as string

        const existingUser = await getExistingUser()

        if (existingUser) {
          const [user] = await orm.select().from(users).where(eq(users.id, existingUser.userId))

          return {
            user: existingUser,
            username: user!.username,
          }
        };

        const user = await createUser({
          attributes: {
            username,
          },
        })

        await createProfile(c, {
          username,
          name: googleUser.given_name,
          lastName: googleUser.family_name,
        })

        return { user, username }
      }

      const { user, username } = await getUser()

      const session = await auth.lucia.createSession({
        userId: user.userId,
        attributes: {},
      })
      const sessionCookie = auth.lucia.createSessionCookie(session)

      c.header('set-cookie', sessionCookie.serialize())
      setCookie(c, 'username', username, {
        path: '/',
      })

      return c.redirect(returnUrl)
    }
    catch (e) {
      if (e instanceof OAuthRequestError)
        return c.body(null, 400)

      return c.body(null, 500)
    }
  })
