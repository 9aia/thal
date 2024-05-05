export interface PlanType {
  amount: number
  name: string
  lookupKey: string
}

export const PLANS = {
  premium: {
    amount: 3999,
    name: "PREMIUM",
    lookupKey: "premium",
  },
}
