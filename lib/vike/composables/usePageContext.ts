import type { PageContext } from "vike/types";
import type { App } from "vue";
import { inject } from "vue";

export { setPageContext, usePageContext };

const key = "__vike-vue__bcc79e46-5797-40d8-9cec-e9daf9c62ce8";

function usePageContext() {
  const pageContext = inject(key);
  return pageContext as PageContext;
}

function setPageContext(app: App, pageContext: PageContext) {
  app.provide(key, pageContext);
}
