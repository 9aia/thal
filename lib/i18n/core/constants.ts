import type { I18nConfig, NumberDeclensionRule } from '..'

export const MESSAGE_PATTERN = /{[^{}]+}\s?(?:\([^)]+\))?|[^{}]+/g

export const DEFAULT_NUMBER_DECLENSION_RULE: NumberDeclensionRule = (
  forms,
  count,
) => {
  return count === 1 ? 0 : forms.length - 1
}

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
