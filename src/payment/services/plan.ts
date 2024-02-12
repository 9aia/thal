import { eq } from "drizzle-orm";
import { DrizzleD1Database } from "drizzle-orm/d1";
import { users } from "~/auth/schemas/auth.schemas";
import { PLANS, PlanType } from "../constants/plans";
import { SQLiteUpdateSetSource } from "drizzle-orm/sqlite-core";
import { now } from "#framework/utils/date";

export const activePlan = async (
  orm: DrizzleD1Database,
  userId: string,
  paymentGatewayCustomerId: string,
  plan: PlanType
) => {
  const expirationDate = now();
  expirationDate.setMonth(expirationDate.getMonth() + 1);

  await orm
    .update(users)
    .set({
      plan: plan?.name,
      payment_gateway_customer_id: paymentGatewayCustomerId,
      plan_expires: expirationDate.toISOString(),
    })
    .where(eq(users.id, userId))
}

export const cancelSubscription = async (
  orm: DrizzleD1Database,
  paymentGatewayCustomerId: string,
) => {
  await orm
    .update(users)
    .set({
      plan: PLANS.free.name,
      payment_gateway_customer_id: null,
      plan_expires: null
    })
    .where(eq(users.payment_gateway_customer_id, paymentGatewayCustomerId))
}

export const updateSubscription = async (
  orm: DrizzleD1Database,
  paymentGatewayCustomerId: string,
  planExpiresAt?: string,
) => {
  const values: SQLiteUpdateSetSource<typeof users> = {}

  if (planExpiresAt) {
    values["plan_expires"] = planExpiresAt
  }

  await orm
    .update(users)
    .set(values)
    .where(eq(users.payment_gateway_customer_id, paymentGatewayCustomerId))
}
