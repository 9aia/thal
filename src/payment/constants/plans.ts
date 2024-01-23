export interface PlanType {
  amount: number,
  name: string,
}

export const PLANS = {
  "free": {
    amount: 0,
    name: "FREE",
  },
  "standard": {
    amount: 2999,
    name: "STANDARD",
  },
  "premium": {
    amount: 3999,
    name: "PREMIUM",
  },
}
