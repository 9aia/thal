import detectLocaleFromAcceptLanguage from '#lib/i18n/core/detection/detectLocaleFromAcceptLanguage'
import detectLocaleFromCookie from '#lib/i18n/core/detection/detectLocaleFromCookie'
import detectLocaleFromNavigator from '#lib/i18n/core/detection/detectLocaleFromNavigator'
import detectLocaleFromPathname from '#lib/i18n/core/detection/detectLocaleFromPathname'
import { getDefaultLocale } from '#lib/i18n/core/utils'
import { getCookies } from '#lib/web/utils/cookies'
import { redirect } from 'vike/abort'
import type { OnBeforeRouteSync } from 'vike/types'
import { isServer } from '../../vike'

const onBeforeRoute: OnBeforeRouteSync = (
  c,
): ReturnType<OnBeforeRouteSync> => {
  const defaultLocale = getDefaultLocale()
  const { urlWithoutLocale, locale } = detectLocaleFromPathname(c.urlPathname)

  if (!locale) {
    const cookies = getCookies(c)

    let locale = detectLocaleFromCookie(cookies.locale)

    if (!locale) {
      const acceptLanguage = isServer ? null : detectLocaleFromNavigator()?.lang

      locale = c.acceptLanguage
        ? detectLocaleFromAcceptLanguage(c.acceptLanguage)?.lang || defaultLocale
        : acceptLanguage || defaultLocale
    }

    if (locale !== defaultLocale && c.urlPathname === urlWithoutLocale)
      throw redirect(`/${locale}${urlWithoutLocale}`)
  }

  return {
    pageContext: {
      urlLogical: urlWithoutLocale,
      urlWithoutLocale,
      locale,
    },
  } as any
}

export default onBeforeRoute
