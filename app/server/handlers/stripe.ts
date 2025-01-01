import type { H3Event } from 'h3'
import type Stripe from 'stripe'
import { activePlan, cancelSubscription, updateSubscription } from '../services/plan'
import { getPlan } from '../../utils/stripe'
import { notFound } from '~/utils/nuxt'
import { PLANS } from '~/constants/payment'
import { fromSToMillis } from '~/utils/date'

export async function handleCheckoutCompleted(
  e: Stripe.CheckoutSessionCompletedEvent,
  event: H3Event,
) {
  const orm = event.context.orm

  const session = e.data.object
  const stripeCustomerId = session.customer as string
  const userId = session.client_reference_id

  if (!userId)
    throw notFound('Client reference not found')

  const isPaymentAsync = session.payment_status !== 'paid'

  if (isPaymentAsync)
    return

  await activePlan(orm, userId, stripeCustomerId, PLANS.premium)
}

export async function handleAsyncPaymentSucceeded(
  e: Stripe.CheckoutSessionAsyncPaymentSucceededEvent,
  event: H3Event,
) {
  const orm = event.context.orm
  const session = e.data.object
  const stripeCustomerId = session.customer as string
  const userId = session.client_reference_id
  const plan = getPlan(session)

  if (!userId)
    throw notFound('Client reference not found')

  if (!plan)
    throw notFound('Plan not found')

  const isPaid = session.payment_status === 'paid'

  if (!isPaid)
    return

  await activePlan(orm, userId, stripeCustomerId, plan)
}

export async function handleCustomerSubscriptionDeleted(
  e: Stripe.CustomerSubscriptionDeletedEvent,
  event: H3Event,
) {
  const orm = event.context.orm
  const session = e.data.object
  const stripeCustomerId = session.customer as string

  if (!stripeCustomerId)
    throw notFound(`Session customer not found: ${stripeCustomerId}`)

  await cancelSubscription(orm, stripeCustomerId)
}

export async function handleCustomerSubscriptionUpdated(
  e: Stripe.CustomerSubscriptionUpdatedEvent,
  event: H3Event,
) {
  const orm = event.context.orm
  const session = e.data.object
  const stripeCustomerId = session.customer as string

  if (!stripeCustomerId)
    throw notFound(`Session customer not found: ${stripeCustomerId}`)

  const cancelAt = session.cancel_at

  const cancelAtDate = cancelAt
    ? new Date(fromSToMillis(cancelAt)).toISOString()
    : undefined

  await updateSubscription(orm, stripeCustomerId, cancelAtDate)
}
