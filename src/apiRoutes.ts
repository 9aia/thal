import { ApiContext } from "#framework/api";
import { Hono } from "hono";
import paymentWebhook from "./payment/routes/webhook";
import paymentCreateSessions from "./payment/routes/create-session";
import profileRoute from "./app/profile/routes/profile";
import summaryRoute from "./app/profile/routes/summary";

const apiRoutes = new Hono<ApiContext>();

export const route = apiRoutes
  .route("/payment/webhook", paymentWebhook)
  .route("/payment", paymentCreateSessions)
  .route("/app/profile", profileRoute)
  .route("/app/summary", summaryRoute);

export default route;