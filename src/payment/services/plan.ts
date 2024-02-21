import { eq } from "drizzle-orm";
import { DrizzleD1Database } from "drizzle-orm/d1";
import { users } from "~/auth/schemas/user";
import { PlanType } from "../constants/plans";
import { SQLiteUpdateSetSource } from "drizzle-orm/sqlite-core";
import { now } from "#lib/lang/utils/date";
import { notFound } from "#lib/hono/utils/httpStatus";

export const activePlan = async (
  orm: DrizzleD1Database,
  userId: string,
  paymentGatewayCustomerId: string,
  plan: PlanType
) => {
  const user = (await orm.select().from(users).where(eq(users.id, userId))).at(0)

  if(!user) {
    throw notFound("User not found")
  }

  const expirationDate = now();

  if(user.free_trial_used === 0) {
    expirationDate.setDate(expirationDate.getDate() + 7);
  } else {
    expirationDate.setMonth(expirationDate.getMonth() + 1);
  }

  await orm
    .update(users)
    .set({
      plan: plan?.name,
      payment_gateway_customer_id: paymentGatewayCustomerId,
      plan_expires: expirationDate.toISOString(),
      free_trial_used: 1,
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
      plan: null,
      payment_gateway_customer_id: null,
      plan_expires: null,
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
