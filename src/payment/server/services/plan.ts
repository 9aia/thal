import { eq } from 'drizzle-orm'
import type { SQLiteUpdateSetSource } from 'drizzle-orm/sqlite-core'
import type { PlanType } from '../../constants/plans'
import { users } from '~/src/base/server/db/schema'
import { DrizzleD1Database } from 'drizzle-orm/d1'
import { now } from '~/src/base/utils/date'
import { notFound } from '~/src/base/utils/nuxt'

export async function activePlan(
  orm: DrizzleD1Database<any>,
  userId: string,
  paymentGatewayCustomerId: string,
  plan: PlanType
) {
  const user = (await orm.select().from(users).where(eq(users.id, userId))).at(0)

  if (!user) {
    throw notFound(`User not found: ${userId}`)
  }

  const expirationDate = now()

  if (user.free_trial_used === 0) {
    expirationDate.setDate(expirationDate.getDate() + 7)
  } else {
    expirationDate.setMonth(expirationDate.getMonth() + 1)
  }

  await orm
    .update(users)
    .set({
      plan: plan.lookupKey,
      payment_gateway_customer_id: paymentGatewayCustomerId,
      plan_expires: expirationDate.toISOString(),
      free_trial_used: 1,
    })
    .where(eq(users.id, userId))
}

export async function cancelSubscription(
  orm: DrizzleD1Database<any>,
  paymentGatewayCustomerId: string
) {
  await orm
    .update(users)
    .set({
      plan: null,
      payment_gateway_customer_id: null,
      plan_expires: null,
    })
    .where(eq(users.payment_gateway_customer_id, paymentGatewayCustomerId))
}

export async function updateSubscription(
  orm: DrizzleD1Database<any>,
  paymentGatewayCustomerId: string,
  planExpiresAt?: string
) {
  const values: SQLiteUpdateSetSource<typeof users> = {}

  if (planExpiresAt) {
    values.plan_expires = planExpiresAt
  }

  await orm
    .update(users)
    .set(values)
    .where(eq(users.payment_gateway_customer_id, paymentGatewayCustomerId))
}
