import { OAuth2RequestError } from 'arctic'
import { createUser, getUser } from '~/src/auth/server/services/user'
import { getGoogleUser } from '../../../utils/google'
import { OAuthAccountInsert } from '~/src/auth/types'
import { UserInsert, deletedOAuthAccounts } from '~/src/base/server/db/schema'
import { badRequest, internal } from '~/src/base/utils/nuxt'
import { and, eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const lucia = event.context.lucia
  const google = event.context.google!
  const orm = event.context.orm

  const storedState = getCookie(event, 'google_oauth_state') ?? null
  const storedCodeVerifier = getCookie(event, 'code_verifier')
  const redirectUrl = getCookie(event, 'redirect_url') || '/'

  const query = getQuery(event)
  const code = query.code?.toString() ?? null
  const state = query.state?.toString() ?? null

  if (!code || !storedState || !storedCodeVerifier || state !== storedState) {
    throw badRequest()
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

      return sendRedirect(event, redirectUrl)
    }

    const username = googleUser.email?.split('@')[0] as string

    const [ deletedOAuth ] = await orm.select().from(deletedOAuthAccounts).where(and(
      eq(deletedOAuthAccounts.providerId, 'google'),
      eq(deletedOAuthAccounts.providerUserId, googleUser.sub)
    ))

    const userInsert: UserInsert = {
      username,
      name: googleUser.given_name,
      lastName: googleUser.family_name,
      email: googleUser.email,
      free_trial_used: deletedOAuth ? 1 : 0,
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

    return sendRedirect(event, redirectUrl)
  } catch (e) {
    console.error(e)

    if (e instanceof OAuth2RequestError) {
      throw badRequest()
    }

    throw internal()
  }
})
