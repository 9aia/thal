import type { NuxtError } from '#app'

export function error(
  statusCode: number,
  message?: string,
  options: Partial<NuxtError<unknown>> = {},
) {
  const err = createError({
    statusCode,
    statusMessage: message,
    ...options,
  })

  if (import.meta.dev)
    console.error(message ? `${statusCode} - ${message}` : `${statusCode}`)

  return err
}

export function notFound(
  message?: string,
  options: Partial<NuxtError<unknown>> = {},
) {
  return error(404, message, options)
}

export function unauthorized(
  message?: string,
  options: Partial<NuxtError<unknown>> = {},
) {
  return error(401, message, options)
}

export function forbidden(
  message?: string,
  options: Partial<NuxtError<unknown>> = {},
) {
  return error(403, message, options)
}

export function internal(
  message?: string,
  options: Partial<NuxtError<unknown>> = {},
) {
  return error(500, message, options)
}

export function badRequest(
  message?: string,
  options: Partial<NuxtError<unknown>> = {},
) {
  return error(400, message, options)
}

export function paymentRequired(
  message?: string,
  options: Partial<NuxtError<unknown>> = {},
) {
  return error(402, message || 'Payment required', options)
}

export function rateLimit(message?: string) {
  return error(429, message || 'Rate limit exceeded')
}
