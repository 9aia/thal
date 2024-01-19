import { Hono } from "hono";
import { serveStatic } from "hono/cloudflare-workers";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import apiRoutes, { ApiContext } from "#framework/api";
import { error } from "#framework/handlers/error";
import { render } from "#framework/handlers/render";

const app = new Hono<ApiContext>();

app.use("*", logger());
app.use("*", cors({ origin: "*" }));

app.route("/", apiRoutes);
app.use("*", serveStatic({ root: "./" }));
app.get("*", render);

app.onError(error);

export default app;
