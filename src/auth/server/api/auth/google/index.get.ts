import { generateCodeVerifier, generateState } from 'arctic'
import { ReturnUrlType, getReturnUrl } from '../../../utils/redirect'

export default defineEventHandler(async (event) => {
  const google = event.context.google!

  const scopeOrigin = 'https://www.googleapis.com'

  const scopes = [
    `${scopeOrigin}/auth/userinfo.email`,
    `${scopeOrigin}/auth/userinfo.profile`,
  ]

  const state = generateState()
  const codeVerifier = generateCodeVerifier()
  const url = await google.createAuthorizationURL(state, codeVerifier, {
    scopes: scopes,
  })

  setCookie(event, 'google_oauth_state', state, {
    httpOnly: true,
    secure: !import.meta.dev,
    path: '/',
    maxAge: 60 * 10, // 10min
  })

  setCookie(event, 'code_verifier', codeVerifier, {
    secure: !import.meta.dev,
    path: '/',
    httpOnly: true,
    maxAge: 60 * 10 // 10min
  })

  const requestUrl = getRequestURL(event)
  const type = requestUrl.searchParams.get('type') as ReturnUrlType | null
  const returnUrl = getReturnUrl(type)

  setCookie(event, 'return_url', returnUrl)

  return sendRedirect(event, url.toString())
})