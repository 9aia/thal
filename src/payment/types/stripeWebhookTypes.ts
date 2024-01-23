export namespace StripeWebhookTypes {
  export interface Root {
    id: string,
    object: string,
    data: Data,
    api_version: string,
    created: number,
    livemode: boolean,
    pending_webhooks: number,
    request: {
      id: number,
      idempotency_key: number
    },
    type: string,
  }

  export interface Data {
    object: Object
  }

  export interface Object {
    amount_subtotal?: number,
    client_reference_id?: string
    customer: string,
    payment_status?: string,
    plan?: Plan
  }

  export interface Plan {
      id: string,
      object: string,
      active: boolean,
      aggregate_usage: any,
      amount: number,
      amount_decimal: string,
      billing_scheme: string,
      created: number,
      currency: string,
      interval: string,
      interval_count: number,
      livemode: boolean,
      metadata: any,
      nickname: any,
      product: string,
      tiers_mode: any,
      transform_usage: any,
      trial_period_days: any,
      usage_type: string,
  }
}
