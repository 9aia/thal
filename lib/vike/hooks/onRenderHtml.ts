import onI18n from "#lib/i18n/hooks/onI18n";
import { renderToNodeStream, renderToString } from "@vue/server-renderer";
import { dangerouslySkipEscape, escapeInject, version } from "vike/server";
import type { OnRenderHtmlAsync } from "vike/types";
import { createAppIsomorphic } from "../utils/createAppIsomorphic";
import { getTitle } from "../utils/getTitle";
import onTheme from "#lib/theme/hooks/onTheme";
import { createSSRApp, defineComponent } from "vue";

checkVikeVersion();

const onRenderHtml: OnRenderHtmlAsync = async (
  pageContext
): ReturnType<OnRenderHtmlAsync> => {
  const { stream } = pageContext.config;
  let pageView:
    | ReturnType<typeof dangerouslySkipEscape>
    | ReturnType<typeof renderToNodeStream>
    | string = "";

  const isSsr = !!pageContext.Page;

  if (isSsr) {
    const app = createAppIsomorphic(pageContext);
    if (pageContext.config.vuePlugins) {
      pageContext.config.vuePlugins.forEach(({ plugin, options }) => {
        app.use(plugin, options);
      });
    }
    
    pageView = !stream
      ? dangerouslySkipEscape(await renderToString(app))
      : renderToNodeStream(app);
  }

  const title = getTitle(pageContext);
  const titleTag = !title ? "" : escapeInject`<title>${title}</title>`;

  const { description } = pageContext.config;
  const descriptionTag = !description
    ? ""
    : escapeInject`<meta name="description" content="${description}" />`;

  const { favicon } = pageContext.config;
  const faviconTag = !favicon
    ? ""
    : escapeInject`<link rel="icon" href="${favicon}" />`;

  let headHtml: ReturnType<typeof dangerouslySkipEscape> | string = "";
  if (!!pageContext.config.Head) {
    const app = createAppIsomorphic(
      pageContext,
      /*ssrApp*/ true,
      /*renderHead*/ true
    );
    headHtml = dangerouslySkipEscape(await renderToString(app));
  }

  const { lang } = onI18n(pageContext);
  const { themeClass, colorScheme } = onTheme(pageContext);

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="${lang}" class="${themeClass}">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no,user-scalable=0">
        <meta name="color-scheme" content="${colorScheme}" />
        ${faviconTag}
        ${titleTag}
        ${descriptionTag}
        ${headHtml}
        
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap" rel="stylesheet">
      </head>
      <body>
        <span id="page-loader" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 loading loading-spinner loading-md ${
          isSsr ? "hidden" : ""
        }"></span>
        <div id="page-view">${pageView}</div>
      </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {
      enableEagerStreaming: true,
    },
  };
};

function checkVikeVersion() {
  if (version) {
    const versionParts = version.split(".").map((s) => parseInt(s, 10)) as [
      number,
      number,
      number
    ];
    if (versionParts[0] > 0) return;
    if (versionParts[1] > 4) return;
    if (versionParts[2] >= 147) return;
  }
  throw new Error(
    "Update Vike to its latest version (or vike@0.4.147 and any version above)"
  );
}

export { onRenderHtml };
