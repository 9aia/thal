import { OAuth2RequestError } from 'arctic'
import { createUser, getUser } from '~/src/auth/server/services/user'
import { getGoogleUser } from '../../../utils/google'
import { OAuthAccountInsert } from '~/src/auth/types'
import { UserInsert } from '~/src/base/server/db/schema'

export default defineEventHandler(async (event) => {
  const lucia = event.context.lucia
  const google = event.context.google!
  const orm = event.context.orm

  const storedState = getCookie(event, 'google_oauth_state') ?? null
  const storedCodeVerifier = getCookie(event, 'code_verifier')
  const returnUrl = getCookie(event, 'return_url') || '/'

  const query = getQuery(event)
  const code = query.code?.toString() ?? null
  const state = query.state?.toString() ?? null

  if (!code || !storedState || !storedCodeVerifier || state !== storedState) {
    throw createError({
      statusCode: 400,
    })
  }

  try {
    const googleUser = await getGoogleUser(google, code, storedCodeVerifier)
    const existingUser = await getUser(orm, {
      providerId: 'google',
      providerUserId: googleUser.sub,
    })

    if (existingUser) {
      const session = await lucia.createSession(existingUser.userId, {})

      appendHeader(
        event,
        'Set-Cookie',
        lucia.createSessionCookie(session.id).serialize()
      )

      return sendRedirect(event, returnUrl)
    }

    const username = googleUser.email?.split('@')[0] as string

    const userInsert: UserInsert = {
      username,
      name: googleUser.given_name,
      lastName: googleUser.family_name,
    }
    const oauthAccountInsert: OAuthAccountInsert = {
      providerId: 'google',
      providerUserId: googleUser.sub,
    }

    const { id: userId } = await createUser(orm, userInsert, oauthAccountInsert)

    const session = await lucia.createSession(userId, {})
    appendHeader(
      event,
      'Set-Cookie',
      lucia.createSessionCookie(session.id).serialize()
    )

    return sendRedirect(event, '/')
  } catch (e) {
    console.error(e)

    if (e instanceof OAuth2RequestError) {
      throw createError({
        statusCode: 400,
      })
    }

    throw createError({
      statusCode: 500,
    })
  }
})
