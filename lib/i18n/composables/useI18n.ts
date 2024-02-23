import { usePageContext } from '#lib/vike/composables/usePageContext'
import { t as tLocale } from '..'

function useI18n() {
  const c = usePageContext()

  const t: typeof tLocale = (text, values, locale) => {
    return tLocale(text, values, locale || c.i18n.locale)
  }

  return { t }
}

export default useI18n
