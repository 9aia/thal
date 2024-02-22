import type { PageContext } from 'vike/types'
import { DEFAULT_I18N_CONFIG, i18nConfig } from '../config'

function onI18n(c: PageContext) {
  const lang = (
    c.i18n?.locale
    || i18nConfig.defaultLocale
    || DEFAULT_I18N_CONFIG.defaultLocale
  )

  return { lang }
}

export default onI18n
