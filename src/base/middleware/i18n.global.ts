import detectLocaleFromAcceptLanguage from '~/lib/i18n/core/detection/detectLocaleFromAcceptLanguage'
import detectLocaleFromCookie from '~/lib/i18n/core/detection/detectLocaleFromCookie'
import detectLocaleFromNavigator from '~/lib/i18n/core/detection/detectLocaleFromNavigator'
import detectLocaleFromPathname from '~/lib/i18n/core/detection/detectLocaleFromPathname'
import { getDefaultLocale } from '~/lib/i18n/core/utils'

export default defineNuxtRouteMiddleware((to, from) => {
  const urlPathname = from.fullPath

  console.log(urlPathname)

  const defaultLocale = getDefaultLocale()
  const { urlWithoutLocale, locale } = detectLocaleFromPathname(urlPathname)

  if (!locale) {
    const localeCookie = useCookie('locale')
    const acceptLanguageHeader = useRequestHeader('accept-language')
    let locale = detectLocaleFromCookie(localeCookie.value || undefined)

    if (!locale) {
      const acceptLanguage = process.server ? null : detectLocaleFromNavigator()?.lang

      locale = acceptLanguageHeader
        ? detectLocaleFromAcceptLanguage(acceptLanguageHeader)?.lang || defaultLocale
        : acceptLanguage || defaultLocale
    }

    /* if (locale !== defaultLocale && urlPathname === urlWithoutLocale)
      return navigateTo(`/${locale}${urlWithoutLocale}`) */
  }

  /*  return {
    pageContext: {
      urlLogical: urlWithoutLocale,
      urlWithoutLocale,
      locale: locale || defaultLocale,
    },
  } as any */
})
