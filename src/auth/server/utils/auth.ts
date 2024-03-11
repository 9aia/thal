import { D1Adapter } from '@lucia-auth/adapter-sqlite'
import { Google } from 'arctic'
import { Lucia } from 'lucia'
import PUBLIC_KEYS from '~/public_keys'
import { UserSelect } from '~/src/base/server/db/schema'
import * as pathe from 'pathe'

export function initializeLucia(D1: D1Database) {
  const adapter = new D1Adapter(D1, {
    user: 'User',
    session: 'Session',
  })

  return new Lucia(adapter, {
    sessionCookie: {
      attributes: {
        secure: !import.meta.dev,
      },
    },
    getUserAttributes: (attributes) => {
      return attributes
    },
  })
}

export function initializeGoogle(
  GOOGLE_CLIENT_SECRET: string,
  appUrl: URL,
) {
  const redirectUri = new URL('/api/auth/google/callback', appUrl).toString()

  const google = new Google(
    PUBLIC_KEYS.GOOGLE_CLIENT_ID!,
    GOOGLE_CLIENT_SECRET,
    redirectUri!,
  )

  return google;
}

declare module 'lucia' {
  interface Register {
    Lucia: ReturnType<typeof initializeLucia>
    DatabaseUserAttributes: UserSelect
  }
}
