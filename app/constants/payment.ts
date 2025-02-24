import type { PlanSettings } from '~/types'

export const PLANS: Record<string, PlanSettings> = {
  allInOne: {
    lookupKey: 'thal_all_in_one',
    trialPeriodDays: 1,
  },
}
