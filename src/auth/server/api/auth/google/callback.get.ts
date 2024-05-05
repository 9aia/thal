import { OAuth2RequestError } from "arctic"
import { getGoogleUser } from "../../../utils/google"
import { createUser, getUser } from "~/src/auth/server/services/user"
import type { OAuthProviderParams } from "~/src/auth/types"
import type { UserInsert } from "~/src/base/server/db/schema"
import { badRequest, internal } from "~/src/base/utils/nuxt"

export default defineEventHandler(async (event) => {
  const lucia = event.context.lucia
  const google = event.context.google!
  const orm = event.context.orm

  const storedState = getCookie(event, "google_oauth_state") ?? null
  const storedCodeVerifier = getCookie(event, "code_verifier")
  const redirectUrl = getCookie(event, "redirect_url") || "/"

  const query = getQuery(event)
  const code = query.code?.toString() ?? null
  const state = query.state?.toString() ?? null

  if (!code || !storedState || !storedCodeVerifier || state !== storedState)
    throw badRequest()

  try {
    const googleUser = await getGoogleUser(google, code, storedCodeVerifier)
    const providerParams: OAuthProviderParams = {
      providerId: "google",
      providerUserId: googleUser.sub,
    }

    const existingUser = await getUser(orm, providerParams)

    if (existingUser) {
      const session = await lucia.createSession(existingUser.userId, {})

      appendHeader(
        event,
        "Set-Cookie",
        lucia.createSessionCookie(session.id).serialize(),
      )

      return sendRedirect(event, redirectUrl)
    }

    const username = generateUsername(googleUser.email!)

    const userInsert: UserInsert = {
      username,
      name: googleUser.given_name,
      lastName: googleUser.family_name,
      email: googleUser.email,
    }

    const { id: userId } = await createUser(orm, userInsert, providerParams)

    const session = await lucia.createSession(userId, {})
    appendHeader(
      event,
      "Set-Cookie",
      lucia.createSessionCookie(session.id).serialize(),
    )

    return sendRedirect(event, redirectUrl)
  }
  catch (e) {
    console.error(e)

    if (e instanceof OAuth2RequestError)
      throw badRequest()

    throw internal()
  }
})
