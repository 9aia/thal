import { Google } from "arctic"
import * as _ from "lodash-es"
import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding"
import type { H3Event } from "h3"
import { type RandomReader, generateRandomString } from "@oslojs/crypto/random"
import PUBLIC_KEYS from "~~/public_keys"

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

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20)
  crypto.getRandomValues(bytes)
  const token = encodeBase32LowerCaseNoPadding(bytes)
  return token
}

const random: RandomReader = {
  read(bytes: Uint8Array): void {
    crypto.getRandomValues(bytes)
  },
}

export function generateId(length: number): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789"
  return generateRandomString(random, alphabet, length)
}
