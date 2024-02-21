import type { NotFoundHandler } from 'hono'

export const routeNotFound: NotFoundHandler = (c) => {
  return c.json({ message: 'API route not found' }, 404)
}
