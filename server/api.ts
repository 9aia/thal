import { drizzle } from "#lib/drizzle/middlewares/drizzle";
import { error } from "#lib/hono/handlers/error";
import { routeNotFound } from "#lib/hono/handlers/routeNotFound";
import { HonoContext } from "#lib/hono/types";
import translateRoute from "#lib/i18n/routes/translate";
import { Hono } from "hono";
import { cors } from "hono/cors";
import externalApiRoutes from "~/apiRoutes";
import lucia from "~/auth/middlewares/lucia";
import authRoute from "~/auth/routes/auth";
import googleAuthRoute from "~/auth/routes/google";

const apiRoutes = new Hono<HonoContext>().basePath("/api");

apiRoutes.get((c) => {
  return c.json({})
})

apiRoutes.use("*", cors());
apiRoutes.use("*", drizzle);
apiRoutes.use("*", lucia);

export const route = apiRoutes
  .route("/auth", authRoute)
  .route("/auth", googleAuthRoute)
  .route("/translate", translateRoute)
  .route("/", externalApiRoutes);

export type AppType = typeof route;

apiRoutes.notFound(routeNotFound);
apiRoutes.all("*", routeNotFound);
apiRoutes.onError(error);

const routes = new Hono<HonoContext>();
routes.route("/", apiRoutes);

export default routes;
