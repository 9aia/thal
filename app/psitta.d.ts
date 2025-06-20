import messages from '~/locales/index'

declare module '@psitta/core' {
  interface Register {
    messages: any
  }
}
