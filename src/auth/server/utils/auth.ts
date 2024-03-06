import { D1Adapter } from '@lucia-auth/adapter-sqlite'
import { Google } from 'arctic'
import { Lucia } from 'lucia'
import { GOOGLE_CLIENT_ID, GOOGLE_OAUTH_REDIRECT_URI } from '~/public_keys.json'

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
      return {
        username: attributes.username,
        name: attributes.name,
        googleId: attributes.google_id,
      }
    },
  })
}

export function initializeGoogle(GOOGLE_CLIENT_SECRET: string) {
  const google = new Google(
    GOOGLE_CLIENT_ID!,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_OAUTH_REDIRECT_URI!,
  )

  return google;
}

declare module 'lucia' {
  interface Register {
    Lucia: ReturnType<typeof initializeLucia>
    DatabaseUserAttributes: DatabaseUserAttributes
  }
}

interface DatabaseUserAttributes {
  name: string
  username: string
  google_id: string
}
