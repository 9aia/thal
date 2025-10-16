import type { PlanSettings } from '#shared/types'

export const SUBSCRIPTION_PLANS = {
  STANDARD_MONTHLY: {
    priceLookupKey: 'standard_monthly',
    trialPeriodDays: 1,
  },
} satisfies Record<string, PlanSettings>
