import { parseLocale } from '#lib/i18n/utils'
import { i18nConfig } from '../config'

function detectLocaleFromNavigator() {
  const language = navigator.language
  const preferred = parseLocale(language)

  if (!i18nConfig.locales?.includes(preferred.lang))
    return null

  return preferred
}

export default detectLocaleFromNavigator
