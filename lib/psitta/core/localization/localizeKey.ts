import type { Config, Locale, Message, RegisteredMessages } from '../index'
import { getConfig } from '../utils'

function localizeKey<T extends keyof RegisteredMessages>(
  key: T,
  locale: Locale,
  options?: Config,
): Message {
  const { defaultLocale, translations, fallbackLocale }
    = options || getConfig()

  if (locale === defaultLocale)
    return key as unknown as Message

  const messages = (translations as unknown)[key]
  const message = messages?.[locale]

  if (!messages || !message) {
    if (!fallbackLocale) {
      throw new Error(
        `No translation found for: \`${
        key
           }\`. To use the default locale, you can enable fallback in the i18n config.`,
      )
    }

    return key as unknown as Message
  }

  return message
}

export default localizeKey
