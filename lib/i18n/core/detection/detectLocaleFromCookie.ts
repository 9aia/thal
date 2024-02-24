import { i18nConfig } from '../config'

function detectLocaleFromCookie(localeCookie: string | undefined) {
  let locale: string | null

  if (localeCookie && i18nConfig.locales?.includes(localeCookie))
    locale = localeCookie
  else
    locale = null

  return locale
}

export default detectLocaleFromCookie
