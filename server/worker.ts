import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import apiRoutes from './api'
import { render } from '#lib/vike/handlers/render'
import type { HonoContext } from '#lib/hono/types'
import { error } from '#lib/hono/handlers/error'

const app = new Hono<HonoContext>()

app.use('*', logger())
app.use('*', cors({ origin: '*' }))

app.route('/', apiRoutes)
app.use('*', serveStatic({ root: './' }))
app.get('*', render)

app.onError(error)

export default app
