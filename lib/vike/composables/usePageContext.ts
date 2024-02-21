import type { PageContext } from 'vike/types'
import type { App } from 'vue'
import { inject } from 'vue'

const key = '__vike-vue__bcc79e46-5797-40d8-9cec-e9daf9c62ce8'

export function usePageContext() {
  const pageContext = inject(key)
  return pageContext as PageContext
}

export function setPageContext(app: App, pageContext: PageContext) {
  app.provide(key, pageContext)
}
