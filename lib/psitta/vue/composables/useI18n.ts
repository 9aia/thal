import tLocale from './t'
import useLocale from './useLocale'

function useI18n() {
  const locale = useLocale().value

  const t: typeof tLocale = (text, values, optionLocale) => {
    return tLocale(text, values, optionLocale || locale)
  }

  return { t, locale }
}

export default useI18n
