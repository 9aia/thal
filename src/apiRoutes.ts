import { ApiContext } from "#framework/api";
import { Hono } from "hono";
import example from "./app/routes/example";

const apiRoutes = new Hono<ApiContext>();

export const route = apiRoutes.route("/app", example);

export default route;