import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("Users", {
  id: text("id").primaryKey(),
  username: text("username").notNull(),
  plan: text("plan").default('Free'),
  payment_gateway_customer_id: text("payment_gateway_customer_id").default(''),
});
