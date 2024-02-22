import type { OnPrerenderStartSync, PageContextServer } from 'vike/types'
import { i18nConfig } from '#lib/i18n'

const onPrerenderStart: OnPrerenderStartSync = (
  prerenderContext,
): ReturnType<OnPrerenderStartSync> => {
  const pageContexts: Array<PageContextServer> = []

  prerenderContext.pageContexts.forEach((c: any) => {
    i18nConfig.locales?.forEach((locale: string) => {
      let { urlOriginal } = c

      if (locale !== i18nConfig.defaultLocale)
        urlOriginal = `/${locale}${c.urlOriginal}`

      pageContexts.push({
        ...c,
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
