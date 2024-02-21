import { i18nConfig } from '#lib/i18n'
import locales from '../locales/index'

i18nConfig.locales = ['en', 'pt']
i18nConfig.translations = locales
i18nConfig.datetimeFormats = {
  en: 'en-US',
  pt: 'pt-BR',
}
i18nConfig.numberFormats = {
  en: 'en-US',
  pt: 'pt-BR',
}

declare global {
  namespace I18n {
    type MessageSchema = typeof locales
  }
}
