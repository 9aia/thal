import type { Locale } from '#lib/i18n'
import { i18nConfig } from '#lib/i18n'

function detectLocaleFromPathname(pathname: string) {
  const urlPaths = pathname.split('/')
  const firstPath = urlPaths[1]

  let urlWithoutLocale = pathname
  let locale: Locale | null

  if (i18nConfig.locales?.includes(firstPath)) {
    locale = firstPath
    urlWithoutLocale = `/${urlPaths.slice(2).join('/')}`
  }
  else {
    locale = null
  }

  return { locale, urlWithoutLocale }
}

export default detectLocaleFromPathname
