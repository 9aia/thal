import { detectLocaleFromAcceptLanguage, detectLocaleFromCookie, detectLocaleFromNavigator, detectLocaleFromPathname, getConfig } from '@psitta/core'
import { useLocale } from '@psitta/vue'

export default defineNuxtRouteMiddleware(async (event) => {
  const { defaultLocale } = getConfig()
  const pathname = event.fullPath

  const { urlWithoutLocale, locale } = detectLocaleFromPathname(pathname)

  if (!locale) {
    const cookie = useCookie('locale').value

    let locale = detectLocaleFromCookie(cookie || undefined)

    if (!locale) {
      const acceptLanguage = process.server ? null : detectLocaleFromNavigator()?.language

      const header = useRequestHeader('accept-language')
      locale = header
        ? detectLocaleFromAcceptLanguage(header)?.language || defaultLocale
        : acceptLanguage || defaultLocale
    }

    if (locale !== defaultLocale && pathname === urlWithoutLocale) {
      if(pathname.startsWith('/api/')) return

      return navigateTo(`/${locale}${urlWithoutLocale}`, { replace: true })
    }
  }

  useLocale().value = locale || defaultLocale
})
