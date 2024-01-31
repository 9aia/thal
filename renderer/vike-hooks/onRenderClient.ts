import { onI18n } from "#framework/i18n";
import type { OnRenderClientAsync } from "vike/types";
import { createAppIsomorphic } from "../utils/createAppIsomorphic.js";
import { getTitle } from "../utils/getTitle.js";

let app: ReturnType<typeof createAppIsomorphic>;

const onRenderClient: OnRenderClientAsync = async (
  pageContext
): ReturnType<OnRenderClientAsync> => {
  if (!app) {
    const container = document.getElementById("page-view")!;
    const isSsr = container.innerHTML !== "";

    app = createAppIsomorphic(pageContext, isSsr);

    if (pageContext.config.vuePlugins) {
      pageContext.config.vuePlugins.forEach(({ plugin, options }) => {
        app.use(plugin, options);
      });
    }

    app.mount(container);
  } else {
    app.changePage(pageContext);

    const title = getTitle(pageContext);
    document.title = title || "";

    const { lang } = onI18n(pageContext);
    document.documentElement.lang = lang;
  }
};

export { onRenderClient };
