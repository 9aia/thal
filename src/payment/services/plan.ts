import { eq } from "drizzle-orm";
import { DrizzleD1Database } from "drizzle-orm/d1";
import { users } from "~/auth/schemas/auth.schemas";
import { PLANS, PlanType } from "../constants/plans";

export const activePlan = async (
  orm: DrizzleD1Database,
  userId: string,
  paymentGatewayCustomerId: string,
  plan: PlanType
) => {
  await orm
    .update(users)
    .set({
      plan: plan?.name,
      payment_gateway_customer_id: paymentGatewayCustomerId
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
      payment_gateway_customer_id: null
    })
    .where(eq(users.payment_gateway_customer_id, paymentGatewayCustomerId))
}
