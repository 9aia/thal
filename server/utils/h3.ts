import type { H3Event } from 'h3'
import type { SafeParseError, SafeParseSuccess, ZodSchema } from 'zod'
import { internal, unprocessableEntity } from '~~/server/utils/nuxt'

export async function getValidatedForm<O>(event: H3Event, validate: (data: unknown) => SafeParseSuccess<O> | SafeParseError<O>) {
  const formData = await readFormData(event)

  if (!(formData instanceof FormData))
    throw unprocessableEntity('Data should be formData')

  const formDataValues = Object.fromEntries(formData.entries())
  return validate(formDataValues)
}

export async function getValidated<O>(
  event: H3Event,
  type: 'body' | 'params' | 'query' | 'form',
  schema: ZodSchema<O>,
) {
  if (type === 'form') {
    const result = await getValidatedForm(event, data => schema.safeParse(data))

    if (!result.success)
      throw unprocessableEntity(`Invalid ${type}`, { data: result.error.issues })

    return result.data
  }

  const validators = {
    params: getValidatedRouterParams,
    body: readValidatedBody,
    query: getValidatedQuery,
  }
  const validator = validators[type]

  if (!validator)
    throw internal()

  const result = await validator(event, data => schema.safeParse(data))

  if (!result.success)
    throw unprocessableEntity(`Invalid ${type}`, { data: result.error.issues })

  return result.data
}

export function getAppUrl(event: H3Event) {
  const isCloudflareReq = !!event.context.cloudflare?.request

  const protocol = import.meta.dev ? 'http:' : 'https:'
  const host = isCloudflareReq
    ? new URL(event.context.cloudflare.request.url).host
    : event.headers.get('host')!

  return new URL(`${protocol}${host}`)
}
