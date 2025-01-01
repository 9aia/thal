import { psitta } from '@psitta/core'
import messages from './locales/index'

psitta({
  locales: ['en', 'pt'],
  messages,
})

declare module '@psitta/core' {
  interface Register {
    messages: any
  }
}
