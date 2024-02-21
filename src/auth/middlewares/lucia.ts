import type { MiddlewareHandler } from 'hono'
import { env } from 'hono/adapter'
import { initAuth } from '~/auth/utils/initAuth'

const lucia: MiddlewareHandler = async (c, next) => {
  const ENV = env(c)
  const auth = initAuth(ENV)

  c.set('auth', auth)
  await next()
}

export default lucia
