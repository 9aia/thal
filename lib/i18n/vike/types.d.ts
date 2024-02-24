declare global {
  namespace Vike {
    interface PageContext {
      locale: string
      urlWithoutLocale: string
      acceptLanguage: string
    }
  }
}

export {}
