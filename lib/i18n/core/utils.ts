import { i18nConfig } from './config'
import { DEFAULT_I18N_CONFIG } from './constants'
import type { I18nConfig, LocaleObject } from './types.d'

export function getConfig(): I18nConfig {
  const defaultLocale = getDefaultLocale()
  const locales = i18nConfig.locales || DEFAULT_I18N_CONFIG.locales

  const translations = i18nConfig.translations || {}
  const fallbackLocale = i18nConfig.fallbackLocale || DEFAULT_I18N_CONFIG.fallbackLocale

  const datetimeFormats = i18nConfig.datetimeFormats || DEFAULT_I18N_CONFIG.datetimeFormats
  const defaultDatetimeFormat = i18nConfig.defaultDatetimeFormat || DEFAULT_I18N_CONFIG.defaultDatetimeFormat
  const numberFormats = i18nConfig.numberFormats || DEFAULT_I18N_CONFIG.numberFormats
  const defaultNumberFormat = i18nConfig.defaultNumberFormat || DEFAULT_I18N_CONFIG.defaultNumberFormat
  const defaultNumberDeclensionRule = i18nConfig.defaultNumberDeclensionRule || DEFAULT_I18N_CONFIG.defaultNumberDeclensionRule
  const numberDeclensionRules = i18nConfig.numberDeclensionRules

  return {
    translations,
    fallbackLocale,
    locales,
    defaultLocale,
    defaultNumberDeclensionRule,
    numberDeclensionRules,
    datetimeFormats,
    defaultDatetimeFormat,
    numberFormats,
    defaultNumberFormat,
  }
}

export function getDefaultLocale() {
  return i18nConfig.defaultLocale || DEFAULT_I18N_CONFIG.defaultLocale
}

export function stringifyLocale(locale: LocaleObject) {
  let str = locale.lang

  if (locale.region)
    str += `-${locale.region}`

  return str
}

export function parseLocale(lang: string): LocaleObject {
  const parsed = lang.split('-')

  return {
    lang: parsed[0],
    region: parsed[1],
  }
}
