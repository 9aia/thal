import { z } from 'zod'
import { numericString } from '~/src/ui/utils/schema'

export const paginatorSchema = z.object({
  page: numericString(z.number().positive().default(1)),
  perPage: numericString(z.number().positive().max(50).default(10)),
})
