import { MiddlewareHandler } from "hono";
import { ApiContext } from "#framework/api";
import { unauthorized } from "#framework/utils/httpThrowers";
import { getCookie } from "hono/cookie";
import { users } from "~/auth/schemas/auth.schemas";
import { eq } from "drizzle-orm";
import { now } from "#framework/utils/date";

interface Options {
  redirect: boolean
}

export const verifyAuthentication = (options?: Options): MiddlewareHandler<ApiContext> => {
  return async (c, next) => {
    const redirect = () => {
      if (!options?.redirect) {
        throw unauthorized()
      }

      return c.redirect('/authentication')
    }

    const { lucia } = c.get('auth')
    const sessionId = getCookie(c, "auth_session");

    if (!sessionId) {
      return redirect()
    }

    const session = await lucia.validateSession(sessionId);

    if (!session) {
      return redirect()
    }

    const orm = c.get('orm')

    const [user] = await orm.select().from(users).where(eq(users.id, session.user.userId))

    if (user.plan && user.plan_expires) {
      const date = now()
      const expirationDate = new Date(user.plan_expires)

      c.set("isPlanExpired", date > expirationDate)
    }

    c.set("session", session)

    await next();
  }
}
