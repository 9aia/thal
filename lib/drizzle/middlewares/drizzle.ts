import { drizzle as _drizzle } from 'drizzle-orm/d1'
import type { MiddlewareHandler } from 'hono'

export const drizzle: MiddlewareHandler = async (c, next) => {
  c.set('orm', _drizzle(c.env?.DB))
  await next()
}
