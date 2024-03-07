import type { H3Event } from "h3"
import type { ZodSchema } from "zod"

async function getValidated<O>(
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

export default getValidated
