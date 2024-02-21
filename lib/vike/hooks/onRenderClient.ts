import onI18n from "#lib/i18n/hooks/onI18n";
import type { OnRenderClientAsync } from "vike/types";
import { createAppIsomorphic } from "../utils/createAppIsomorphic";
import { getTitle } from "../utils/getTitle";

let app: ReturnType<typeof createAppIsomorphic>;

const onRenderClient: OnRenderClientAsync = async (
  pageContext
): ReturnType<OnRenderClientAsync> => {
  document.querySelector("#page-loader")?.remove();

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
    (app as any).changePage(pageContext);

    const title = getTitle(pageContext);
    document.title = title || "";

    const { lang } = onI18n(pageContext);
    document.documentElement.lang = lang;
  }
};

export { onRenderClient };
