import type { H3Event } from 'h3'
import type { RouteLocationNormalized } from 'vue-router'
import type { ZodSchema } from 'zod'
import { internal, badRequest } from '~/src/base/utils/nuxt'

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
    throw internal()
  }

  const result = await validator(event, data => schema.safeParse(data))

  if (!result.success) {
    throw badRequest(`Invalid ${type}`, { data: result.error.issues })
  }

  return result.data
}

export function getAppUrl(event: H3Event) {
  const protocol = import.meta.dev ? 'http:' : 'https:'
  const host = event.headers.get('host')!

  return new URL(`${protocol}${host}`)
}

export function sendBackRedirect(from: H3Event | RouteLocationNormalized, redirectUrl: string | null) {
	const cookie = useRedirectUrl()
  cookie.value = from.path

  return navigateTo(redirectUrl)
}
