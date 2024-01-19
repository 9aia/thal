import { MiddlewareHandler } from "hono";
import { initAuth } from "#framework/utils/initAuth";
import { env } from "hono/adapter";

export const auth: MiddlewareHandler = async (c, next) => {
  const ENV = env(c);
  const auth = initAuth(ENV);

  c.set("auth", auth);
  await next();
};
