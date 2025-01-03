import { z } from 'zod'
import { numericString } from '~/utils/zod'

export interface PaginationOptions {
  defaultPage?: number
  maxPerPage?: number
  defaultPerPage?: number
}

export function paginationSchema(options: PaginationOptions = {}) {
  return z.object({
    page: numericString(z.number().positive().default(options.defaultPage ?? 1)),
    perPage: numericString(z.number().positive().max(options.maxPerPage ?? 50).default(options.defaultPerPage ?? 10)),
  })
}

const _paginationSchema = paginationSchema()

export type Pagination = z.infer<typeof _paginationSchema>
