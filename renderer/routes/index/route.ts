import { Handler } from "hono";
import { ApiContext } from "#framework/api";

export const index: Handler<ApiContext> = (c) => {
  return c.json({ message: "Hi from the API!" });
};
