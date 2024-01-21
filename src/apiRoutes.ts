import { ApiContext } from "#framework/api";
import { Hono } from "hono";
import example from "./app/routes/example";
import paymentWebhook from "./payment/routes/webhook";

const apiRoutes = new Hono<ApiContext>();

export const route = apiRoutes
  .route("/app", example)
  .route("/payment/webhook", paymentWebhook);

export default route;