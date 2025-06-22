import { psitta } from '@psitta/core'
import messages from './app/locales/index'

export const localeDefaultRegionMap: Record<string, string> = {
  pt: 'pt-BR',
  en: 'en-US',
}

psitta({
  locales: ['en', 'pt'],
  messages,
})
