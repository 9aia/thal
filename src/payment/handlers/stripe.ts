import type { Context } from 'hono'
import type Stripe from 'stripe'
import { PLANS } from '../constants/plans'
import { activePlan, cancelSubscription, updateSubscription } from '../services/plan'
import { getPlan } from '../utils/stripe'
import { fromSToMillis } from '#lib/lang/utils/date'
import type { HonoContext } from '#lib/hono/types'

export async function handleCheckoutCompleted(
  e: Stripe.CheckoutSessionCompletedEvent,
  c: Context<HonoContext>,
) {
  const orm = c.get('orm')

  const session = e.data.object
  const stripeCustomerId = session.customer as string
  const userId = session.client_reference_id

  if (!userId)
    throw new Error('userId not found')

  const isPaymentAsync = session.payment_status !== 'paid'

  if (isPaymentAsync)
    return

  console.log('executing activePlan', userId, stripeCustomerId, PLANS.premium)

  await activePlan(orm, userId, stripeCustomerId, PLANS.premium)
}

export async function handleAsyncPaymentSucceeded(
  e: Stripe.CheckoutSessionAsyncPaymentSucceededEvent,
  c: Context<HonoContext>,
) {
  const orm = c.get('orm')
  const session = e.data.object
  const stripeCustomerId = session.customer as string
  const userId = session.client_reference_id
  const plan = getPlan(session)

  if (!userId)
    throw new Error('client_reference_id is null')

  if (!plan)
    throw new Error('plan not found')

  const isPaid = session.payment_status === 'paid'

  if (!isPaid)
    return

  await activePlan(orm, userId, stripeCustomerId, plan)
}

export async function handleCustomerSubscriptionDeleted(
  e: Stripe.CustomerSubscriptionDeletedEvent,
  c: Context<HonoContext>,
) {
  const orm = c.get('orm')
  const session = e.data.object
  const stripeCustomerId = session.customer as string

  if (!stripeCustomerId)
    throw new Error('stripeCustomerId not found')

  await cancelSubscription(orm, stripeCustomerId)
}

export async function handleCustomerSubscriptionUpdated(
  e: Stripe.CustomerSubscriptionUpdatedEvent,
  c: Context<HonoContext>,
) {
  const orm = c.get('orm')
  const session = e.data.object
  const stripeCustomerId = session.customer as string

  if (!stripeCustomerId)
    throw new Error('stripeCustomerId not found')

  const cancelAt = session.cancel_at

  const cancelAtDate = cancelAt
    ? new Date(fromSToMillis(cancelAt)).toISOString()
    : undefined

  await updateSubscription(orm, stripeCustomerId, cancelAtDate)
}
