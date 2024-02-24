import { i18nConfig } from './core/config'
import type { I18nConfig, ILocale, Locale } from './core/types.d'
import { getConfig, getDefaultLocale } from './core/utils'

export function stringifyLocale(locale: ILocale) {
  let str = locale.lang

  if (locale.region)
    str += `-${locale.region}`

  return str
}

export function parseLocale(lang: string): ILocale {
  const parsed = lang.split('-')

  return {
    lang: parsed[0],
    region: parsed[1],
  }
}

export function localizeHref(href?: string, locale?: string) {
  if (getDefaultLocale() === locale || !href || !locale)
    return href

  const protocolRegex = /^(?:[a-z]+:)?\/\//i

  if (protocolRegex.test(href))
    return href

  const path = href.startsWith('/') ? href.slice(1) : href

  return `/${locale}/${path}`
}

export function getMessage(text: string, locale: Locale, options?: I18nConfig) {
  const { defaultLocale, translations, fallbackLocale }
    = options || getConfig()

  if (locale === defaultLocale)
    return text

  const messages = (translations as any)[text]
  const message = messages?.[locale]

  if (!messages || !message) {
    if (!fallbackLocale) {
      throw new Error(
        `No translation found for: \`${
        text
           }\`. To use the default locale, you can enable fallback in the i18n config.`,
      )
    }

    return text
  }

  return message
}
