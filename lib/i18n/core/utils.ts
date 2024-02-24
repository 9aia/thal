import type { I18nConfig, Locale } from './types.d'
import { DEFAULT_I18N_CONFIG } from './constants'
import { i18nConfig } from './config'

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

export function getDefaultLocale() {
  return i18nConfig.defaultLocale || DEFAULT_I18N_CONFIG.defaultLocale
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
