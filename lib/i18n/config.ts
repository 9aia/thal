import { DEFAULT_NUMBER_DECLENSION_RULE } from './format'
import type { I18nConfig } from './types.d'

export const DEFAULT_I18N_CONFIG = {
  locales: ['en'],
  defaultLocale: 'en',
  fallbackLocale: true,
  defaultNumberDeclensionRule: DEFAULT_NUMBER_DECLENSION_RULE,
  defaultDatetimeFormat: 'en-US',
  defaultNumberFormat: 'en-US',
  datetimeFormats: undefined,
  numberFormats: undefined,
} satisfies I18nConfig

export const i18nConfig: I18nConfig = {
  ...DEFAULT_I18N_CONFIG,
}
