import { inject } from 'vue'
import { t as tLocale } from '../..'

function useI18n() {
  const locale = inject<string>('__locale')!

  const t: typeof tLocale = (text, values, optionLocale) => {
    return tLocale(text, values, optionLocale || locale)
  }

  return { t, locale }
}

export default useI18n
