import type { Config, Locale } from '../index'
import { getConfig } from '../utils'

export function getNumberDeclensionRule(locale: Locale, options?: Config) {
  const { numberDeclensionRules, defaultNumberDeclensionRule }
    = options || getConfig()

  return numberDeclensionRules?.[locale] || defaultNumberDeclensionRule
}

export function getDatetimeFormat(locale: Locale, options?: Config) {
  const { datetimeFormats, defaultDatetimeFormat } = options || getConfig()

  return datetimeFormats?.[locale] || defaultDatetimeFormat
}

export function getNumberFormat(locale: Locale, options?: Config) {
  const { datetimeFormats, defaultDatetimeFormat } = options || getConfig()

  return datetimeFormats?.[locale] || defaultDatetimeFormat
}

export function getFormatOptions(locale: Locale, options?: Config) {
  const numberDeclensionRule = getNumberDeclensionRule(locale, options)
  const datetimeFormat = getDatetimeFormat(locale, options)
  const numberFormat = getNumberFormat(locale, options)
  const formatOptions = { numberDeclensionRule, datetimeFormat, numberFormat }

  return formatOptions
}
