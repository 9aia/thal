import { type Locale, getConfig } from '../index'

function detectLocaleFromCookie(localeCookie: string | undefined) {
  const config = getConfig()
  let locale: Locale | null

  if (localeCookie && config.locales?.includes(localeCookie))
    locale = localeCookie
  else
    locale = null

  return locale
}

export default detectLocaleFromCookie
