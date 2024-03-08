import type { H3Event } from "h3"
import type { RouteLocationNormalized } from "vue-router"
import type { ZodSchema } from "zod"

export async function getValidated<O>(
  event: H3Event, type: 'body' | 'params' | 'query',
  schema: ZodSchema<O>
) {
  const validators = {
    params: getValidatedRouterParams,
    body: readValidatedBody,
    query: getValidatedQuery,
  }
  const validator = validators[type]

  if (!validator) {
    throw createError({
      statusCode: 500
    })
  }

  const result = await validator(event, data => schema.safeParse(data))

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: `Invalid ${type}`,
      data: result.error.issues,
    })
  }

  return result.data
}

export function getAppUrl(event: H3Event) {
  const protocol = import.meta.dev ? 'http:' : 'https:'
  const host = event.headers.get('host')!

  return new URL(`${protocol}${host}`)
}

export function sendBackRedirect(from: H3Event | RouteLocationNormalized, redirectUrl: string | null) {
	const cookie = useCookie('redirect_url', { path: '/' })
  cookie.value = from.path

  return navigateTo(redirectUrl)
}
