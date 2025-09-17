import type { PlanSettings } from '~/types'

export const SUBSCRIPTION_PLANS: Record<string, PlanSettings> = {
  STANDARD_MONTHLY: {
    priceLookupKey: 'standard_monthly',
    trialPeriodDays: 1,
  },
} as const
