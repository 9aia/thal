/// <reference types="./worker-configuration.d.ts" />

import type { DrizzleD1Database } from 'drizzle-orm/d1'
import type * as schema from '~~/server/db/schema'

declare module 'h3' {
  interface H3EventContext {
    cf: CfProperties
    cloudflare: {
      request: Request
      env: Env
      context: ExecutionContext
    }
  }
}

export {}
