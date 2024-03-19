import { initPsitta } from '@psitta/core'
import translations from './locales/index'

initPsitta({
  locales: ['en', 'pt'],
  translations,
  datetimeFormats: { en: 'en-US', pt: 'pt-BR' },
  numberFormats: { en: 'en-US', pt: 'pt-BR' },
})

declare module '@psitta/core' {
  interface Register {
    messages: typeof translations
  }
}
