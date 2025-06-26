// TODO: remove this file after psitta is updated
import messages from '~/locales/index'

declare module '@psitta/core' {
  interface Register {
    messages: any
  }
}
