import { ApiContext } from "#framework/api";
import { d1 } from "@lucia-auth/adapter-sqlite";
import { google } from "@lucia-auth/oauth/providers";
import { lucia as luciaFn } from "lucia";
import { hono } from "lucia/middleware";
import { GOOGLE_OAUTH_REDIRECT_URI, GOOGLE_CLIENT_ID } from "../../public_keys.json"

export type Auth = ReturnType<typeof initAuth>["lucia"];

export const initAuth = (ENV: ApiContext["Bindings"]) => {
  const lucia = luciaFn({
    env: ENV.ENVIRONMENT,
    middleware: hono(),
    adapter: d1(ENV.DB, {
      user: "Users",
      key: "UserKeys",
      session: "UserSessions",
    }),
    sessionCookie: {
      expires: false,
    },

    getUserAttributes: (data) => {
      return {
        googleUsername: data.username,
      };
    },
  });

  const scopeOrigin = "https://www.googleapis.com";

  const googleAuth = google(lucia, {
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: ENV.GOOGLE_CLIENT_SECRET,
    redirectUri: GOOGLE_OAUTH_REDIRECT_URI,
    scope: [
      `${scopeOrigin}/auth/userinfo.email`,
      `${scopeOrigin}/auth/userinfo.profile`,
    ],
  });

  return {
    lucia,
    googleAuth,
  };
};
