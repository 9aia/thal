import type { OnPrerenderStartSync, PageContextServer } from 'vike/types'
import { i18nConfig } from '#lib/i18n'

const onPrerenderStart: OnPrerenderStartSync = (
  prerenderContext,
): ReturnType<OnPrerenderStartSync> => {
  const pageContexts: Array<PageContextServer> = []

  prerenderContext.pageContexts.forEach((pageContext: any) => {
    i18nConfig.locales?.forEach((locale: string) => {
      let { urlOriginal } = pageContext

      if (locale !== i18nConfig.defaultLocale)
        urlOriginal = `/${locale}${pageContext.urlOriginal}`

      pageContexts.push({
        ...pageContext,
        urlOriginal,
        locale,
      })
    })
  })

  return {
    prerenderContext: {
      pageContexts,
    },
  }
}

export default onPrerenderStart
