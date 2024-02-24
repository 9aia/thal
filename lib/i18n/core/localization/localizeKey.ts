import type { I18nConfig, Key, Locale, Message } from '../types'
import { getConfig } from '../utils'

function localizeKey(
  key: Key,
  locale: Locale,
  options?: I18nConfig,
): Message {
  const { defaultLocale, translations, fallbackLocale }
    = options || getConfig()

  if (locale === defaultLocale)
    return key

  const messages = (translations as any)[key]
  const message = messages?.[locale]

  if (!messages || !message) {
    if (!fallbackLocale) {
      throw new Error(
        `No translation found for: \`${
        key
           }\`. To use the default locale, you can enable fallback in the i18n config.`,
      )
    }

    return key
  }

  return message
}

export default localizeKey
