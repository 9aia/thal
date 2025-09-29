import { sql } from 'drizzle-orm'
import { int } from 'drizzle-orm/sqlite-core'

export const createdAt = int('created_at', { mode: 'timestamp_ms' }).notNull().default(sql`(unixepoch() * 1000)`)
export const updatedAt = int('updated_at', { mode: 'timestamp_ms' })
export const deletedAt = int('deleted_at', { mode: 'timestamp_ms' })

export const timestamps = {
  createdAt,
  updatedAt,
  deletedAt,
} as const

export const timestampOmits: { [K in keyof typeof timestamps]: true } = {
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
}
