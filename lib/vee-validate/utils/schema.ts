import { z } from 'zod'

export function numericString(schema: z.ZodTypeAny) {
  return z.preprocess((value) => {
    if (typeof value === 'string')
      return Number(value)
    else if (typeof value === 'number')
      return value
    else
      return undefined
  }, schema) as z.ZodEffects<z.ZodTypeAny, number, number>
}
