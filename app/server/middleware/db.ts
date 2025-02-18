import process from 'node:process'
import { type DrizzleD1Database, drizzle as initializeDrizzle } from 'drizzle-orm/d1'
import * as schema from '../../../db/schema'
import { internal } from '~/utils/nuxt'

export default defineEventHandler(async (event) => {
  // @ts-expect-error globalThis.env is not defined
  const db = event.context.cloudflare?.env.DB || process.env.DB || globalThis.__env__?.DB || globalThis.DB

  if (!db)
    throw internal('DB is not set in the environment')

  event.context.orm = initializeDrizzle(db, {
    schema,
  })
})

declare module 'h3' {
  interface H3EventContext {
    orm: DrizzleD1Database<typeof schema>
    cf: CfProperties
    cloudflare: {
      request: Request
      env: Env
      context: ExecutionContext
    }
  }
}
