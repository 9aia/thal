import getLang from '#lib/i18n/vike/getLang'
import type { OnRenderClientAsync } from 'vike/types'
import { createAppIsomorphic } from '../utils/createAppIsomorphic'
import { getTitle } from '../utils/getTitle'

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

    const lang = getLang(c)
    document.documentElement.lang = lang
  }
}

export { onRenderClient }
