import { parseCookie } from 'lucia/utils'
import type { MiddlewareHandler } from 'hono'
import { renderPage } from 'vike/server'
import getUser from '../utils/getUser'
import type { HonoContext } from '#lib/hono/types'

export const render: MiddlewareHandler<HonoContext> = async (c, next) => {
  const cookies = c.req.header('cookie') || ''
  const user = getUser(cookies)

  const pageContextInit = {
    urlOriginal: c.req.url,
    acceptLanguage: c.req.header('accept-language'),
    cookies,
    cookiesParsed: parseCookie(cookies),
    userAgent: c.req.header('user-agent'),
    user,
  }

  const pageContext = await renderPage(pageContextInit)
  const { httpResponse } = pageContext

  if (httpResponse === null) {
    await next()
    return
  }

  const { statusCode, headers } = httpResponse

  const { readable, writable } = new TransformStream()
  httpResponse.pipe(writable)

  headers.forEach(([name, value]: [string, string]) => {
    c.header(name, value)
  })

  return c.newResponse(readable, statusCode)
}
