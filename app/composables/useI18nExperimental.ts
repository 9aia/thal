import { dn as dnLocale, t as tLocale, u as uLocale, useLocale, v as vLocale } from '@psitta/vue'

// TODO: remove this after Psitta API is updated
export default function useI18nExperimental() {
  const localeRef = useLocale()

  const t: typeof tLocale = (text, context, options) => {
    const locale = localeRef.value
    return tLocale(text, context, options || { locale })
  }

  const dn: typeof dnLocale = (code, intlOptions, options) => {
    const locale = localeRef.value
    return dnLocale(code, intlOptions, options || { locale })
  }

  const v: typeof vLocale = (value, options) => {
    const locale = localeRef.value
    return vLocale(value, options || { locale })
  }

  const u: typeof uLocale = (url, context, options) => {
    const locale = localeRef.value
    return uLocale(url, context, options || { locale })
  }

  return { locale: localeRef, t, dn, v, u }
}
