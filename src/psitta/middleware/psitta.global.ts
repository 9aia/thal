import { detectLocaleFromAcceptLanguage, detectLocaleFromCookie, detectLocaleFromNavigator, detectLocaleFromPathname, getDefaultLocale } from '@psitta/core'
import { useLocale } from '@psitta/vue'

export default defineNuxtRouteMiddleware(async (event) => {
  const defaultLocale = getDefaultLocale()
  const pathname = event.fullPath

  const { urlWithoutLocale, locale } = detectLocaleFromPathname(pathname)

  if (!locale) {
    const cookie = useCookie('locale').value

    let locale = detectLocaleFromCookie(cookie || undefined)

    if (!locale) {
      const acceptLanguage = process.server ? null : detectLocaleFromNavigator()?.lang


      const header = useRequestHeader('accept-language')
      locale = header
        ? detectLocaleFromAcceptLanguage(header)?.lang || defaultLocale
        : acceptLanguage || defaultLocale
    }

    if (locale !== defaultLocale && pathname === urlWithoutLocale) {
      return navigateTo(`/${locale}${urlWithoutLocale}`, { replace: true })
    }
  }

  useLocale().value = locale || defaultLocale
})
