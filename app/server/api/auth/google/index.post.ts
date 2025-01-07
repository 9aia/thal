import { generateCodeVerifier, generateState } from 'arctic'
import { z } from 'zod'
import { getValidated } from '~/utils/h3'
import { badRequest } from '~/utils/nuxt'
import { validateTurnstileToken } from '~/utils/captcha'

export default defineEventHandler(async (event) => {
  const google = event.context.google!

  const scopeOrigin = 'https://www.googleapis.com'

  const scopes = [
    `${scopeOrigin}/auth/userinfo.email`,
    `${scopeOrigin}/auth/userinfo.profile`,
  ]

  const { cfTurnstileResponse } = await getValidated(event, 'body', z.object({
    cfTurnstileResponse: z.string(),
  }))

  const isTurnstileValid = await validateTurnstileToken(cfTurnstileResponse)

  if (!isTurnstileValid)
    throw badRequest('Invalid captcha challenge')

  const state = generateState()
  const codeVerifier = generateCodeVerifier()
  const url = google.createAuthorizationURL(state, codeVerifier, scopes)

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
    maxAge: 60 * 10, // 10min
  })

  return sendRedirect(event, url.toString())
})
