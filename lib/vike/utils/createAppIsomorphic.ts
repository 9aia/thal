import { setPageContext } from '#lib/vike/composables/usePageContext'
import type { Config, PageContext } from 'vike/types'
import type {
  Component,
  VNode,
} from 'vue'
import {
  createApp,
  createSSRApp,
  defineComponent,
  h,
  markRaw,
  reactive,
} from 'vue'
import type { PageProps } from '../types'

/**
 * Isomorphic function to create a Vue app.
 *
 * @param c Object providing the Vue component to be rendered, the props for that component, and additional
 *                    config and data.
 * @param ssrApp Whether to use `createSSRApp()` or `createApp()`. See https://vuejs.org/api/application.html
 * @param renderHead If true, `c.config.Head` will be rendered instead of `c.Page`.
 */
export function createAppIsomorphic(
  c: PageContext,
  ssrApp = true,
  renderHead = false,
) {
  const { Page } = c
  const Head = renderHead ? (c.config.Head as Component) : undefined

  let rootComponent: Component & {
    Page: Component
    pageProps: PageProps
    config: Config
  }
  const PageWithLayout = defineComponent({
    data: () => ({
      Page: markRaw(Head || (Page!)),
      config: markRaw(c.config),
    }),
    created() {
      // @ts-expect-error
      // eslint-disable-next-line
      rootComponent = this
    },
    render() {
      let wrappedNode: VNode

      if (!!this.config.Layout && !renderHead) {
        wrappedNode = h(
          this.config.Layout,
          {},
          {
            default: () => {
              return h(this.Page)
            },
          },
        )
      }
      else {
        wrappedNode = h(this.Page)
      }

      if (this.config.Wrapper) {
        return h(
          this.config.Wrapper,
          {},
          {
            default: () => wrappedNode,
          },
        )
      }

      return wrappedNode
    },
  })

  const app = ssrApp ? createSSRApp(PageWithLayout) : createApp(PageWithLayout)

  // When doing Client Routing, we mutate pageContext (see usage of `app.changePage()` in `onRenderClient.ts`).
  // We therefore use a reactive pageContext.
  const pageContextReactive = reactive(c)

  // Make `pageContext` accessible from any Vue component
  setPageContext(app, pageContextReactive)

  // We use `app.changePage()` to do Client Routing, see `onRenderClient.ts`
  Object.assign(app, {
    changePage: (c: PageContext) => {
      Object.assign(pageContextReactive, c)
      rootComponent.Page = markRaw(c.Page!)
      rootComponent.config = markRaw(c.config)
    },
  })

  return app
}
