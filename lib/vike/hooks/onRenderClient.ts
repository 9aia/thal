import type { OnRenderClientAsync } from 'vike/types'
import { createAppIsomorphic } from '../utils/createAppIsomorphic'
import { getTitle } from '../utils/getTitle'
import onI18n from '#lib/i18n/hooks/onI18n'

let app: ReturnType<typeof createAppIsomorphic>

const onRenderClient: OnRenderClientAsync = async (
  c,
): ReturnType<OnRenderClientAsync> => {
  document.querySelector('#page-loader')?.remove()

  if (!app) {
    const container = document.getElementById('page-view')!
    const isSsr = container.innerHTML !== ''

    app = createAppIsomorphic(c, isSsr)

    if (c.config.vuePlugins) {
      c.config.vuePlugins.forEach(({ plugin, options }) => {
        app.use(plugin, options)
      })
    }

    app.mount(container)
  }
  else {
    (app as any).changePage(c)

    const title = getTitle(c)
    document.title = title || ''

    const { lang } = onI18n(c)
    document.documentElement.lang = lang
  }
}

export { onRenderClient }
