import { detectLocaleFromAcceptLanguage, detectLocaleFromCookie, detectLocaleFromNavigator, getConfig } from '@psitta/core'

export default defineNuxtRouteMiddleware(() => {
  const { defaultLocale } = getConfig()

  const cookie = useCookie('locale')

  let locale = detectLocaleFromCookie(cookie.value || undefined)

  if (!locale) {
    // eslint-disable-next-line nuxt/prefer-import-meta, node/prefer-global/process
    const acceptLanguage = process.server ? null : detectLocaleFromNavigator()?.language

    const header = useRequestHeader('accept-language')
    locale = header
      ? detectLocaleFromAcceptLanguage(header)?.language || defaultLocale
      : acceptLanguage || defaultLocale

    cookie.value = locale
  }
})
