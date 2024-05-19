import { getConfig } from "@psitta/core"
import "../../../i18n"
import type { NuxtPage } from "nuxt/schema"
import { defineNuxtModule } from "nuxt/kit"

export interface ModuleOptions {
  forcePathSymbol: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "psitta",
    configKey: "psitta",
  },
  defaults: {
    forcePathSymbol: "!",
  },
  async setup({ forcePathSymbol }, nuxt) {
    nuxt.addHooks({
      "pages:extend": (pages) => {
        const i18nConfig = getConfig()

        pages.forEach((page, index) => {
          if (page.path.includes(forcePathSymbol))
            pages[index] = pageWithoutSymbol(page, forcePathSymbol)

          i18nConfig.locales.forEach((locale) => {
            if (locale === i18nConfig.defaultLocale)
              return

            pages.push(localizedPage(page, locale, forcePathSymbol))
          })
        })
      },
    })
  },
})

function changeChildrenNamesRecursively(children: NuxtPage[], locale: string) {
  return children.map((child) => {
    if (child.children)
      child.children = changeChildrenNamesRecursively(child.children, locale)

    return {
      ...child,
      name: `${child.name}-${locale}`,
    }
  })
}

function removeLastIndex(path: string) {
  if (path.endsWith("index"))
    return path.slice(0, -5)

  return path
}

function normalizePath(path: string, symbol: string) {
  const [_, newPath] = path.split(`${symbol}`)

  if (newPath)
    return `/${removeLastIndex(newPath)}`

  return path
}

function localizedPage(page: NuxtPage, locale: string, symbol: string) {
  const path = normalizePath(page.path, symbol)
  const nameWithoutSymbol = page.name?.replace(symbol, "")

  const children = changeChildrenNamesRecursively(page.children || [], locale)

  return {
    ...page,
    name: nameWithoutSymbol ? `${nameWithoutSymbol}-${locale}` : undefined,
    path: `/${locale}${path}`,
    children,
  }
}

function pageWithoutSymbol(page: NuxtPage, symbol: string) {
  const path = normalizePath(page.path, symbol)

  return {
    ...page,
    name: page.name?.replace(symbol, ""),
    path,
  }
}
