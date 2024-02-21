import { hc } from 'hono/client'
import type { AppType } from '../../server/api'

const client = hc<AppType>(
  import.meta.env.DEV || import.meta.env.SSR
    ? 'http://127.0.0.1:8787/api'
    : '/api',
)
type ApiType = typeof client['api']

export default client as unknown as ApiType
