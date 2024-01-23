import { DrizzleD1Database } from "drizzle-orm/d1"
import { PLANS, PlanType } from "../constants/plans"
import { activePlan, cancelSubscription } from "../services/payment"

export const checkoutCompleted = async (
  orm: DrizzleD1Database,
  userId: string,
  paymentGatewayCustomerId: string,
  plan: PlanType,
  isPaid: boolean,
) => {
  if (!isPaid) {
    return
  }

  await activePlan(orm, userId, paymentGatewayCustomerId, plan)
}

export const subscriptionCanceled = async (
  orm: DrizzleD1Database,
  paymentGatewayCustomerId: string,
) => {
  await cancelSubscription(orm, paymentGatewayCustomerId)
}
