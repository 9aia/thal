import { drizzle as initializeDrizzle, type DrizzleD1Database } from 'drizzle-orm/d1'

let drizzle: ReturnType<typeof initializeDrizzle>

export default defineEventHandler(async (event) => {
  const { DB } = event.context.cloudflare.env

  if (!drizzle) {
    drizzle = initializeDrizzle(DB)
  }

  event.context.orm = drizzle
})

declare module 'h3' {
  interface H3EventContext {
    orm: DrizzleD1Database<Record<string, unknown>>
    cf: CfProperties
    cloudflare: {
      request: Request
      env: Env
      context: ExecutionContext
    }
  }
}