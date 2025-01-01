import type { ZodSchema } from 'zod'

function yupify(schema: ZodSchema, errorMessage: string) {
  return (value: any) => schema.safeParse(value).success || errorMessage
}

export default yupify
