import { initPsitta } from '~/lib/psitta/core'
import translations from './locales/index'

initPsitta({
  locales: ['en', 'pt'],
  translations,
  datetimeFormats: { en: 'en-US', pt: 'pt-BR' },
  numberFormats: { en: 'en-US', pt: 'pt-BR' },
})

declare module '~/lib/psitta/core' {
  interface Register {
    messages: typeof translations
  }
}
