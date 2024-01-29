import { ApiContext } from "#framework/api";
import { MiddlewareHandler } from "hono";
import { env } from "hono/adapter";
import { unauthorized } from "#framework/utils/httpThrowers";

export const turnstile = (): MiddlewareHandler<ApiContext> => {
  return async (c, next) => {
    const ip = c.req.header("CF-Connecting-IP");
    // @ts-ignore
    const { token } = c.req.valid("json");

    const { TURNSTILE_SECRET_KEY } = env(c);

    if (!token) {
      throw unauthorized("Token is required");
    }

    const formData = new FormData();
    formData.append("secret", TURNSTILE_SECRET_KEY);
    formData.append("response", token);
    formData.append("remoteip", ip as string);

    const url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
    const result = await fetch(url, {
      body: formData,
      method: "POST",
    }).then((res) => res.json());

    // @ts-ignore
    if (result.success) {
      await next();
    } else {
      throw unauthorized("Invalid token");
    }
  };
};
