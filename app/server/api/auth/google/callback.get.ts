import { OAuth2RequestError, type OAuth2Tokens } from 'arctic'
import { eq } from 'drizzle-orm'
import { getGoogleUser } from '../../../../utils/google'
import { createUser, getUser } from '../../../services/user'
import { createSession, setSessionTokenCookie } from '~/server/services/auth'
import type { OAuthProviderParams } from '~/server/types'
import { generateSessionToken, generateUsernameByEmail } from '~/utils/auth'
import { badRequest, internal } from '~/utils/nuxt'
import { type UserInsert, users } from '~~/db/schema'
import { now } from '~/utils/date'

export default defineEventHandler(async (event) => {
  const google = event.context.google!
  const orm = event.context.orm

  const storedState = getCookie(event, 'google_oauth_state') ?? null
  const codeVerifier = getCookie(event, 'code_verifier')
  const redirectUrl = getCookie(event, 'redirect_url') || '/'

  setCookie(event, 'google_oauth_state', '', {
    httpOnly: true,
    secure: !import.meta.dev,
    path: '/',
    sameSite: 'lax',
    maxAge: 0,
  })

  setCookie(event, 'code_verifier', '', {
    secure: !import.meta.dev,
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 0,
  })

  const query = getQuery(event)
  const code = query.code?.toString() ?? null
  const state = query.state?.toString() ?? null

  if (!code || !storedState || !codeVerifier || state !== storedState)
    throw badRequest()

  try {
    let tokens: OAuth2Tokens
    try {
      tokens = await google.validateAuthorizationCode(code, codeVerifier)
    }
    catch {
      return new Response('Please restart the process.', {
        status: 400,
      })
    }

    const googleUser = getGoogleUser(tokens)
    const providerParams: OAuthProviderParams = {
      providerId: 'google',
      providerUserId: googleUser.sub,
    }

    const existingUser = await getUser(orm, providerParams)

    if (existingUser) {
      const token = generateSessionToken()
      const session = await createSession(orm, token, existingUser.userId)
      setSessionTokenCookie(event, token, session.expiresAt)

      const [user] = await orm.select().from(users).where(eq(users.id, existingUser.userId))

      setCookie(event, 'user_reactivated', user.deactivatedAt ? '1' : '')

      if (user.deactivatedAt) {
        await orm.update(users).set({
          deactivatedAt: null,
          updatedAt: now(),
        }).where(eq(users.id, user.id))
      }

      return sendRedirect(event, redirectUrl)
    }

    const userInsert: UserInsert = {
      username: generateUsernameByEmail(googleUser.email!),
      name: googleUser.givenName,
      lastName: googleUser.familyName,
      email: googleUser.email,
    }

    const user = await createUser(orm, userInsert, providerParams)

    const token = generateSessionToken()
    const session = await createSession(orm, token, user.id)
    setSessionTokenCookie(event, token, session.expiresAt)

    return sendRedirect(event, redirectUrl)
  }
  catch (e) {
    console.error(e)

    if (e instanceof OAuth2RequestError)
      throw badRequest()

    throw internal()
  }
})
