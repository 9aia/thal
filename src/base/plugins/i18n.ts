import type { Locale } from '~/lib/i18n'
import '~/i18n'
import { getDefaultLocale } from '~/lib/i18n/core/utils'

export default defineNuxtPlugin((nuxtApp) => {
  const c = { locale: getDefaultLocale() }
  nuxtApp.vueApp.provide('__locale', computed<Locale>(() => c.locale))
})
