import type { I18nConfig, Locale } from '../types'
import { getConfig } from '../utils'

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
