import { i18nConfig } from '../config'
import type { Locale } from '../types'

function detectLocaleFromCookie(localeCookie: string | undefined) {
  let locale: Locale | null

  if (localeCookie && i18nConfig.locales?.includes(localeCookie))
    locale = localeCookie
  else
    locale = null

  return locale
}

export default detectLocaleFromCookie
