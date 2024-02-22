import { d1 } from '@lucia-auth/adapter-sqlite'
import { google } from '@lucia-auth/oauth/providers'
import { lucia as luciaFn } from 'lucia'
import { hono } from 'lucia/middleware'
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_OAUTH_REDIRECT_URI,
} from '../../../public_keys.json'
import type { HonoContext } from '#lib/hono/types'

export type Auth = ReturnType<typeof initAuth>['lucia']

export function initAuth(ENV: HonoContext['Bindings']) {
  const lucia = luciaFn({
    env: ENV.ENVIRONMENT,
    middleware: hono(),
    adapter: d1(ENV.DB, {
      user: 'Users',
      key: 'UserKeys',
      session: 'UserSessions',
    }),
    sessionCookie: {
      expires: false,
    },

    getUserAttributes: (data) => {
      return {
        profileId: data.profile_id,
      }
    },
  })

  const scopeOrigin = 'https://www.googleapis.com'

  const googleAuth = google(lucia, {
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: ENV.GOOGLE_CLIENT_SECRET,
    redirectUri: GOOGLE_OAUTH_REDIRECT_URI,
    scope: [
      `${scopeOrigin}/auth/userinfo.email`,
      `${scopeOrigin}/auth/userinfo.profile`,
    ],
  })

  return {
    lucia,
    googleAuth,
  }
}
