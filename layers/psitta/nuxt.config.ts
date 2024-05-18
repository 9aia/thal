import { getConfig } from "@psitta/core"
import "../../i18n"

export default defineNuxtConfig({
  hooks: {
    "pages:extend": (pages) => {
      const i18nConfig = getConfig()

      pages.forEach((page) => {
        i18nConfig.locales.forEach((locale) => {
          if (locale === i18nConfig.defaultLocale)
            return

          pages.push({
            ...page,
            name: `${page.name}-${locale}`,
            path: `/${locale}${page.path}`,
          })
        })
      })
    },
  },
})
