import { Google } from "arctic"

export async function getGoogleUser(
  google: Google,
  code: string,
  codeVerifier: string
) {
  const tokens = await google.validateAuthorizationCode(code, codeVerifier)
  const response = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: {
      Authorization: `Bearer ${tokens.accessToken}`
    }
  })
  const user: GoogleUser = await response.json()

  return user
}

interface GoogleUser {
  sub: string
  email: string
  given_name: string
  family_name: string
  picture: string
  locale: string
  email_verified: boolean
  name: string
}
