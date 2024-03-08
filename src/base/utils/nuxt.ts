import type { NuxtError } from "#app"

export function error(
  statusCode: number,
  message?: string,
  options: Partial<NuxtError<unknown>> = {}
) {
  return createError({
    statusCode,
    statusMessage: message,
    ...options,
  })
}

export function notFound(
  message?: string,
  options: Partial<NuxtError<unknown>> = {}
) {
  return createError({
    statusCode: 404,
    statusMessage: message,
    ...options,
  })
}

export function unauthorized(
  message?: string,
  options: Partial<NuxtError<unknown>> = {}
) {
  return createError({
    statusCode: 401,
    statusMessage: message,
    ...options,
  })
}

export function forbidden(
  message?: string,
  options: Partial<NuxtError<unknown>> = {}
) {
  return createError({
    statusCode: 401,
    statusMessage: message,
    ...options,
  })
}

export function internal(
  message?: string,
  options: Partial<NuxtError<unknown>> = {}
) {
  return createError({
    statusCode: 401,
    statusMessage: message,
    ...options,
  })
}

export function badRequest(
  message?: string,
  options: Partial<NuxtError<unknown>> = {}
) {
  return createError({
    statusCode: 400,
    statusMessage: message,
    ...options,
  })
}
