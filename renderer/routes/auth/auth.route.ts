import { ApiContext } from "#framework/api";
import { unauthorized } from "#framework/utils/httpThrowers";
import { OAuthRequestError } from "@lucia-auth/oauth";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

const authRouter = new Hono<ApiContext>();

export default authRouter
  .get("/verify-login", async (c) => {
    const auth = c.get("auth");
    const sessionId = getCookie(c, "auth_session");

    if (!sessionId) {
      throw unauthorized()
    }

    const session = await auth.lucia.getSession(sessionId);

    if (!session) {
      throw unauthorized()
    }

    return c.json({ authenticated: true });
  })
  .post("/logout", async (c) => {
    const auth = c.get("auth");

    const sessionId = getCookie(c, "auth_session");

    if (!sessionId) {
      return c.redirect("/authentication")
    }

    const session = await auth.lucia.getSession(sessionId);
    
    if (!session) {
      return c.redirect("/authentication")
    }

    await auth.lucia.invalidateSession(sessionId);
    deleteCookie(c, "auth_session")
    deleteCookie(c, "google_oauth_state")

    return c.redirect("/authentication")
  })
  .get("/google", async (c) => {
    const auth = c.get("auth");
    const { DEV } = env(c);

    const [url, state] = await auth.googleAuth.getAuthorizationUrl();

    setCookie(c, "google_oauth_state", state, {
      httpOnly: true,
      secure: !DEV,
      path: "/",
      maxAge: 60 * 60,
    });

    return c.redirect(url.toString());
  })
  .get("/google/callback", async (c) => {
    const auth = c.get("auth");

    const storedState = getCookie(c, "google_oauth_state");

    const url = new URL(c.req.url);
    const state = url.searchParams.get("state");
    const code = url.searchParams.get("code");

    if (!storedState || !state || storedState !== state || !code) {
      return c.body(null, 400);
    }
    try {
      const { getExistingUser, googleUser, createUser } =
        await auth.googleAuth.validateCallback(code);

      const getUser = async () => {
        const existingUser = await getExistingUser();
        if (existingUser) return existingUser;

        const username = googleUser.email?.split("@")[0] as string;

        const user = await createUser({
          attributes: {
            username,
          },
        });
        return user;
      };

      const user = await getUser();
      const session = await auth.lucia.createSession({
        userId: user.userId,
        attributes: {},
      });
      const sessionCookie = auth.lucia.createSessionCookie(session);

      c.header("set-cookie", sessionCookie.serialize());

      return c.redirect("/");
    } catch (e) {
      if (e instanceof OAuthRequestError) {
        return c.body(null, 400);
      }

      return c.body(null, 500);
    }
  });
