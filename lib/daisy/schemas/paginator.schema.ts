import { z } from 'zod'
import { numericString } from '~/lib/daisy/utils/schema'

export const paginatorSchema = z.object({
  page: numericString(z.number().positive().default(1)),
  perPage: numericString(z.number().positive().max(50).default(10)),
})
