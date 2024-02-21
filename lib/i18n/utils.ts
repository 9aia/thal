import { DEFAULT_I18N_CONFIG, i18nConfig } from './config'
import type { I18nConfig, ILocale, Locale } from './types'

export function getConfig() {
  const defaultLocale
    = i18nConfig.defaultLocale || DEFAULT_I18N_CONFIG.defaultLocale
  const locales = i18nConfig.locales || DEFAULT_I18N_CONFIG.locales

  const translations = i18nConfig.translations || {}
  const fallbackLocale
    = i18nConfig.fallbackLocale || DEFAULT_I18N_CONFIG.fallbackLocale

  const defaultNumberDeclensionRule
    = i18nConfig.defaultNumberDeclensionRule
    || DEFAULT_I18N_CONFIG.defaultNumberDeclensionRule

  const datetimeFormats
    = i18nConfig.datetimeFormats || DEFAULT_I18N_CONFIG.datetimeFormats
  const defaultDatetimeFormat
    = i18nConfig.defaultDatetimeFormat
    || DEFAULT_I18N_CONFIG.defaultDatetimeFormat
  const numberFormats
    = i18nConfig.numberFormats || DEFAULT_I18N_CONFIG.numberFormats
  const defaultNumberFormat
    = i18nConfig.defaultNumberFormat || DEFAULT_I18N_CONFIG.defaultNumberFormat

  return {
    translations,
    fallbackLocale,
    locales,
    defaultLocale,
    defaultNumberDeclensionRule,
    numberDeclensionRules: i18nConfig.numberDeclensionRules,
    datetimeFormats,
    defaultDatetimeFormat,
    numberFormats,
    defaultNumberFormat,
  } satisfies I18nConfig
}

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

export function detectLocale(acceptLanguageHeader: string) {
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

export function detectLocaleClient(language: string) {
  const preferred = parseLocale(language)

  if (!i18nConfig.locales?.includes(preferred.lang))
    return null

  return preferred
}

export function extractLocale(pathname: string) {
  const urlPaths = pathname.split('/')
  const firstPath = urlPaths[1]

  let urlWithoutLocale = pathname
  let locale

  if (i18nConfig.locales?.includes(firstPath)) {
    locale = firstPath
    urlWithoutLocale = `/${urlPaths.slice(2).join('/')}`
  }

  return { locale, urlWithoutLocale }
}

export function localizeHref(href?: string, locale?: string) {
  if (i18nConfig.defaultLocale === locale || !href || !locale)
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

export function getNumberDeclensionRule(locale: Locale, options?: I18nConfig) {
  const { numberDeclensionRules, defaultNumberDeclensionRule }
    = options || getConfig()

  return numberDeclensionRules?.[locale] || defaultNumberDeclensionRule
}

export function getDatetimeFormat(locale: Locale, options?: I18nConfig) {
  const { datetimeFormats, defaultDatetimeFormat } = options || getConfig()

  return datetimeFormats?.[locale] || defaultDatetimeFormat
}

export function getNumberFormat(locale: Locale, options?: I18nConfig) {
  const { datetimeFormats, defaultDatetimeFormat } = options || getConfig()

  return datetimeFormats?.[locale] || defaultDatetimeFormat
}

export function getFormatOptions(locale: Locale, options?: I18nConfig) {
  const numberDeclensionRule = getNumberDeclensionRule(locale, options)
  const datetimeFormat = getDatetimeFormat(locale, options)
  const numberFormat = getNumberFormat(locale, options)
  const formatOptions = { numberDeclensionRule, datetimeFormat, numberFormat }

  return formatOptions
}
