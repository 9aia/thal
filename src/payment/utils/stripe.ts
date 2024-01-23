import Stripe from "stripe";
import { PLANS } from "../constants/plans";

export const webCrypto = Stripe.createSubtleCryptoProvider();

export function getStripe({ stripeKey }: { stripeKey: string }) {
  if (!stripeKey) {
    throw new Error("Can not initialize Stripe without stripe key");
  }

  const client = new Stripe(stripeKey, {
    httpClient: Stripe.createFetchHttpClient(),
  });
  return client;
}

export function getPlan(session: Stripe.Checkout.Session) {
  return Object.values(PLANS).find(
    (plan) => plan.amount === session.amount_subtotal
  );
}
