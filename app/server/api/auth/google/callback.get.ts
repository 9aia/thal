import { OAuth2RequestError, type OAuth2Tokens } from "arctic"
import { getGoogleUser } from "../../../../utils/google"
import { createUser, getUser } from "../../../services/user"
import { createSession, setSessionTokenCookie } from "~/server/services/auth"
import type { OAuthProviderParams } from "~/server/types"
import { generateSessionToken, generateUsername } from "~/utils/auth"
import { badRequest, internal } from "~/utils/nuxt"
import type { UserInsert } from "~~/db/schema"

export default defineEventHandler(async (event) => {
  const google = event.context.google!
  const orm = event.context.orm

  const storedState = getCookie(event, "google_oauth_state") ?? null
  const codeVerifier = getCookie(event, "code_verifier")
  const redirectUrl = getCookie(event, "redirect_url") || "/"

  const query = getQuery(event)
  const code = query.code?.toString() ?? null
  const state = query.state?.toString() ?? null

  if (!code || !storedState || !codeVerifier || state !== storedState)
    throw badRequest()

  try {
    let tokens: OAuth2Tokens
    try {
      tokens = await google.validateAuthorizationCode(code, codeVerifier)
    }
    catch {
      return new Response("Please restart the process.", {
        status: 400,
      })
    }

    const googleUser = getGoogleUser(tokens)
    const providerParams: OAuthProviderParams = {
      providerId: "google",
      providerUserId: googleUser.sub,
    }

    const existingUser = await getUser(orm, providerParams)

    if (existingUser) {
      const token = generateSessionToken()
      const session = await createSession(orm, token, existingUser.userId)
      setSessionTokenCookie(event, token, session.expiresAt)

      return sendRedirect(event, redirectUrl)
    }

    const userInsert: UserInsert = {
      username: generateUsername(googleUser.email!),
      name: googleUser.givenName,
      lastName: googleUser.familyName,
      email: googleUser.email,
    }

    const user = await createUser(orm, userInsert, providerParams)

    const token = generateSessionToken()
    const session = await createSession(orm, token, user.id)
    setSessionTokenCookie(event, token, session.expiresAt)

    return sendRedirect(event, redirectUrl)
  }
  catch (e) {
    console.error(e)

    if (e instanceof OAuth2RequestError)
      throw badRequest()

    throw internal()
  }
})
