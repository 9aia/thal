import { sql } from 'drizzle-orm'
import { int } from 'drizzle-orm/sqlite-core'

export const timestamps = {
  createdAt: int('created_at', { mode: 'timestamp_ms' }).notNull().default(sql`(unixepoch() * 1000)`),
  updatedAt: int('updated_at', { mode: 'timestamp_ms' }),
  deletedAt: int('deleted_at', { mode: 'timestamp_ms' }),
} as const

export const timestampOmits: { [K in keyof typeof timestamps]: true } = {
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
}
