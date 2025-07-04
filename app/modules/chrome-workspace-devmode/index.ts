import { addDevServerHandler, defineNuxtModule } from 'nuxt/kit'
import { defineEventHandler } from 'h3'

export default defineNuxtModule({
  meta: {
    name: 'chrome-workspace-devmode',
    configKey: 'layerOptions',
    compatibility: {
      nuxt: '^3.0.0',
      bridge: false,
    },
  },
  defaults: {},
  async setup(_, nuxt) {
    addDevServerHandler({
      route: '/.well-known/appspecific/com.chrome.devtools.json',
      handler: defineEventHandler(() => {
        return {
          workspace: {
            root: nuxt.options.rootDir,
            uuid: '2b6f89d0-9ef7-4d60-ab07-9f71dc3404af',
          },
        }
      }),
    })
  },
})
