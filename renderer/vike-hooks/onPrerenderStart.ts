import { i18nConfig } from "../i18n";
import { OnPrerenderStartSync, PageContextServer } from "vike/types";

const onPrerenderStart: OnPrerenderStartSync = (
  prerenderContext
): ReturnType<OnPrerenderStartSync> => {
  const pageContexts: Array<PageContextServer> = [];

  prerenderContext.pageContexts.forEach((pageContext: any) => {
    i18nConfig.locales?.forEach((locale: string) => {
      let { urlOriginal } = pageContext;

      if (locale !== i18nConfig.defaultLocale) {
        urlOriginal = `/${locale}${pageContext.urlOriginal}`;
      }

      pageContexts.push({
        ...pageContext,
        urlOriginal,
        locale,
      });
    });
  });

  return {
    prerenderContext: {
      pageContexts,
    },
  };
};

export default onPrerenderStart;