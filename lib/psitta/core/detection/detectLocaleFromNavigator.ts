import { getConfig, parseLocale } from '../utils'

function detectLocaleFromNavigator() {
  const language = navigator.language
  const preferred = parseLocale(language)
  const config = getConfig()

  if (!config.locales?.includes(preferred.lang))
    return null

  return preferred
}

export default detectLocaleFromNavigator
