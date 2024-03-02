import { hc } from 'hono/client'
import type { AppType } from '../../server/api'

const client = hc<AppType>(
  '/api',
)
type ApiType = typeof client['api']

export default client as unknown as ApiType
