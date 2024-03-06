const returnUrls = {
  'pricing': '/api/payment/stripe/create-checkout-session',
} as const

export type ReturnUrlType = keyof typeof returnUrls

export function getReturnUrl(type: ReturnUrlType | null) {
  const returnUrls = {
    'pricing': '/api/payment/stripe/create-checkout-session',
  }
  const returnUrl = (type && returnUrls[type]) || '/'

  return returnUrl
}