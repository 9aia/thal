import { setPageContext } from "#framework/composables/usePageContext";
import { objectAssign } from "#framework/utils/objectAssign";
import type { Config, PageContext } from "vike/types";
import {
  VNode,
  createApp,
  createSSRApp,
  defineComponent,
  h,
  markRaw,
  reactive,
} from "vue";
import type { Component, PageProps } from "../types";

/**
 * Isomorphic function to create a Vue app.
 *
 * @param pageContext Object providing the Vue component to be rendered, the props for that component, and additional
 *                    config and data.
 * @param ssrApp Whether to use `createSSRApp()` or `createApp()`. See https://vuejs.org/api/application.html
 * @param renderHead If true, `pageContext.config.Head` will be rendered instead of `pageContext.Page`.
 */
export function createAppIsomorphic(
  pageContext: PageContext,
  ssrApp = true,
  renderHead = false
) {
  const { Page } = pageContext;
  const Head = renderHead ? (pageContext.config.Head as Component) : undefined;

  let rootComponent: Component & {
    Page: Component;
    pageProps: PageProps;
    config: Config;
  };
  const PageWithLayout = defineComponent({
    data: () => ({
      Page: markRaw(Head ? Head : Page),
      config: markRaw(pageContext.config),
    }),
    created() {
      rootComponent = this;
    },
    render() {
      let wrappedNode: VNode;

      if (!!this.config.Layout && !renderHead) {
        wrappedNode = h(
          this.config.Layout,
          {},
          {
            default: () => {
              return h(this.Page);
            },
          }
        );
      } else {
        wrappedNode = h(this.Page);
      }

      if (!!this.config.Wrapper) {
        return h(
          this.config.Wrapper,
          {},
          {
            default: () => wrappedNode,
          }
        );
      }

      return wrappedNode;
    },
  });

  const app = ssrApp ? createSSRApp(PageWithLayout) : createApp(PageWithLayout);

  // We use `app.changePage()` to do Client Routing, see `onRenderClient.ts`
  objectAssign(app, {
    changePage: (pageContext: PageContext) => {
      Object.assign(pageContextReactive, pageContext);
      rootComponent.Page = markRaw(pageContext.Page);
      rootComponent.config = markRaw(pageContext.config);
    },
  });

  // When doing Client Routing, we mutate pageContext (see usage of `app.changePage()` in `onRenderClient.ts`).
  // We therefore use a reactive pageContext.
  const pageContextReactive = reactive(pageContext);

  // Make `pageContext` accessible from any Vue component
  setPageContext(app, pageContextReactive);

  return app;
}
