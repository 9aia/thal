import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("Users", {
  id: text("id").primaryKey(),
  username: text("username").notNull(),
  plan: text("plan").default('FREE'),
  payment_gateway_customer_id: text("payment_gateway_customer_id").default(''),
  payment_gateway_session_id: text("payment_gateway_session_id").default(''),
});
