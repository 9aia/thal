import { detectLocaleFromAcceptLanguage, detectLocaleFromCookie, detectLocaleFromNavigator, detectLocaleFromPathname, getConfig } from '@psitta/core'
import type { RouteLocationNormalized } from 'vue-router'

export default defineNuxtRouteMiddleware((to: RouteLocationNormalized) => {
  const { defaultLocale } = getConfig()
  const pathname = to.fullPath

  const { urlWithoutLocale, locale } = detectLocaleFromPathname(pathname)

  if (!locale) {
    const cookie = useCookie('locale').value

    let locale = detectLocaleFromCookie(cookie || undefined)

    if (!locale) {
      // eslint-disable-next-line nuxt/prefer-import-meta, node/prefer-global/process
      const acceptLanguage = process.server ? null : detectLocaleFromNavigator()?.language

      const header = useRequestHeader('accept-language')
      locale = header
        ? detectLocaleFromAcceptLanguage(header)?.language || defaultLocale
        : acceptLanguage || defaultLocale
    }

    if (locale !== defaultLocale && pathname === urlWithoutLocale) {
      if (pathname.startsWith('/api/'))
        return

      return navigateTo(`/${locale}${urlWithoutLocale}`, { replace: true })
    }
  }
})
