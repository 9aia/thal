import process from 'node:process'
import { drizzle as initializeDrizzle } from 'drizzle-orm/d1'
import * as schema from '~~/server/db/schema'

export default defineEventHandler(async (event) => {
  // @ts-expect-error globalThis.env is not defined
  const db = event.context.cloudflare?.env.DB || process.env.DB || globalThis.__env__?.DB || globalThis.DB

  event.context.orm = initializeDrizzle(db, {
    schema,
  })
})
