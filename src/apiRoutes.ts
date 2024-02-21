import { Hono } from "hono";
import paymentWebhook from "./payment/routes/webhook";
import paymentCreateSessions from "./payment/routes/create-session";
import profileRoute from "./app/profile/routes/profile";
import summaryRoute from "./app/profile/routes/summary";
import exerciseRoute from "./app/play/routes/exercise";
import { HonoContext } from "#lib/hono/types";

const apiRoutes = new Hono<HonoContext>();

export const route = apiRoutes
  .route("/payment/webhook", paymentWebhook)
  .route("/payment", paymentCreateSessions)
  .route("/app/profile", profileRoute)
  .route("/app/summary", summaryRoute)
  .route("/exercise", exerciseRoute);

export default route;