import type { NuxtError } from '#app'

export function error(
  statusCode: number,
  message?: string,
  options: Partial<NuxtError<unknown>> = {},
) {
  if (import.meta.dev)
    console.error(`Error ${statusCode} - ${message}`)

  return createError({
    statusCode,
    statusMessage: message,
    ...options,
  })
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

export function updateRedirectUrl() {
  const route = useRoute()
  const redirectUrl = useRedirectUrl()
  redirectUrl.value = route.path
}

export function rateLimit(message?: string) {
  return error(429, message || 'Rate limit exceeded')
}
