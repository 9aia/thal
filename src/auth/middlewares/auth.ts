import { HonoContext } from "#lib/hono/types";
import { unauthorized } from "#lib/hono/utils/httpStatus";
import { now } from "#lib/lang/utils/date";
import { eq } from "drizzle-orm";
import { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import { users } from "~/auth/schemas/user";
import { APP_URL } from "../../../public_keys.json";

interface Options {
  redirect: boolean;
  redirectType?: "pricing";
}

export const auth = (options?: Options): MiddlewareHandler<HonoContext> => {
  return async (c, next) => {
    const redirect = () => {
      if (!options?.redirect) {
        throw unauthorized();
      }

      const url = new URL(APP_URL);

      url.pathname = "/authentication";
      if (options.redirectType)
        url.searchParams.set("type", options.redirectType);

      return c.redirect(url.toString());
    };

    const { lucia } = c.get("auth");
    const sessionId = getCookie(c, "auth_session");

    if (!sessionId) {
      return redirect();
    }

    const session = await lucia.validateSession(sessionId);

    if (!session) {
      return redirect();
    }

    const orm = c.get("orm");

    const [user] = await orm
      .select()
      .from(users)
      .where(eq(users.id, session.user.userId));

    if (user.plan && user.plan_expires) {
      const date = now();
      const expirationDate = new Date(user.plan_expires);

      c.set("isPlanExpired", date > expirationDate);
    }

    c.set("session", session);

    await next();
  };
};

export default auth;
