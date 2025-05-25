import type { DrizzleD1Database } from 'drizzle-orm/d1'
import type * as schema from '~~/db/schema'

declare module '@9aia/castor' {
  interface Register {
    database: DrizzleD1Database<typeof schema>
  }
}
