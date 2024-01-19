import { Hono } from "hono";

export default new Hono().get("/", (c) => {
  return c.json({ message: "Hello world!" });
});
