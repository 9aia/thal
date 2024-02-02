import { error } from "#framework/handlers/error";
import { routeNotFound } from "#framework/handlers/routeNotFound";
import { drizzle } from "#framework/middlewares/drizzle";
import { index } from "#framework/routes/index/route";
import { DrizzleD1Database } from "drizzle-orm/d1";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "#framework/middlewares/auth";
import { initAuth } from "#framework/utils/initAuth";
import externalApiRoutes from "~/apiRoutes";
import authRoute from "./routes/auth/auth.route";
import translateRoute from "./i18n/routes/translate";

type Bindings = {
  ENVIRONMENT: 'DEV' | 'PROD';
  DB: D1Database;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  TURNSTILE_SECRET_KEY: string;
  STRIPE_SECRET_KEY: string;
  STRIPE_ENDPOINT_SECRET: string;
};
type Variables = {
  orm: DrizzleD1Database;
  auth: ReturnType<typeof initAuth>;
  valid: any;
};

export type ApiContext = { Bindings: Bindings; Variables: Variables };

const apiRoutes = new Hono<ApiContext>().basePath("/api");

apiRoutes.use("*", cors());
apiRoutes.use("*", drizzle);
apiRoutes.use("*", auth);

apiRoutes.get("/", index);

export const route = apiRoutes
  .route("/auth", authRoute)
  .route("/translate", translateRoute)
  .route("/", externalApiRoutes);

export type AppType = typeof route;

apiRoutes.notFound(routeNotFound);
apiRoutes.all("*", routeNotFound);
apiRoutes.onError(error);

const routes = new Hono<ApiContext>();
routes.route("/", apiRoutes);

export default routes;
