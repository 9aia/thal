import type { Config } from 'vike/types'

import './types.d'

export default {
  onBeforeRoute: 'import:./onBeforeRoute:default',
  onPrerenderStart: 'import:./onPrerenderStart:default',
  passToClient: ['locale', 'urlWithoutLocale', 'acceptLanguage'],
} satisfies Config
