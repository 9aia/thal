import { i18nConfig } from '~/lib/i18n'
import { parseLocale } from '~/lib/i18n/core/utils'

function detectLocaleFromAcceptLanguage(acceptLanguageHeader: string) {
  const preferredLanguages = acceptLanguageHeader.split(',').map((lang) => {
    const [language, priority = 'q=1.0'] = lang.trim().split(';')
    return { lang: language, priority: Number.parseFloat(priority.split('=')[1]) }
  })

  preferredLanguages.sort((a, b) => b.priority - a.priority)

  let lang

  for (const preferred of preferredLanguages) {
    if (i18nConfig.locales?.includes(preferred.lang)) {
      lang = preferred.lang
      break
    }
  }

  if (!lang)
    return undefined

  return parseLocale(lang)
}

export default detectLocaleFromAcceptLanguage
