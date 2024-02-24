import type { Config } from 'vike/types'
import config from '../lib/vike/config'
import i18n from '../lib/i18n/vike/config'

export default {
  extends: [config, i18n],
} satisfies Config
