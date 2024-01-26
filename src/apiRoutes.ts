import { ApiContext } from "#framework/api";
import { Hono } from "hono";
import example from "./app/routes/example";
import paymentWebhook from "./payment/routes/webhook";
import paymentCreateSessions from "./payment/routes/create-session";
import profileRoute from "./app/profile/routes/profile";

const apiRoutes = new Hono<ApiContext>();

export const route = apiRoutes
  .route("/app", example)
  .route("/payment/webhook", paymentWebhook)
  .route("/payment", paymentCreateSessions)
  .route("/profile", profileRoute);

export default route;