import { D1Adapter } from "@lucia-auth/adapter-sqlite"
import { Google } from "arctic"
import { Lucia } from "lucia"
import * as _ from "lodash-es"
import PUBLIC_KEYS from "~/public_keys"
import type { UserSelect } from "~/src/base/server/db/schema"

export function initializeLucia(D1: D1Database) {
  const adapter = new D1Adapter(D1, {
    user: "User",
    session: "Session",
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
  const redirectUri = new URL("/api/auth/google/callback", appUrl).toString()

  const google = new Google(
    PUBLIC_KEYS.GOOGLE_CLIENT_ID!,
    GOOGLE_CLIENT_SECRET,
    redirectUri!,
  )

  return google
}

export function generateUsername(email: string) {
  const username = email.split("@")[0]
  const suffix = _.random(1000, 9999)

  return username + suffix
}

declare module "lucia" {
  interface Register {
    Lucia: ReturnType<typeof initializeLucia>
    DatabaseUserAttributes: UserSelect
  }
}
