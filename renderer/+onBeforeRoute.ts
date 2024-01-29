import {
  DEFAULT_I18N_CONFIG,
  I18nGlobal,
  extractLocale,
  i18nConfig,
} from "./i18n";
import { OnBeforeRouteSync } from "vike/types";

const onBeforeRoute: OnBeforeRouteSync = (
  pageContext
): ReturnType<OnBeforeRouteSync> => {
  const { urlWithoutLocale, locale } = extractLocale(pageContext.urlPathname);

  const i18n: I18nGlobal = {
    urlWithoutLocale,
    url: pageContext.urlPathname,
    locale:
      locale || i18nConfig.defaultLocale || DEFAULT_I18N_CONFIG.defaultLocale,
  };

  return {
    pageContext: {
      urlLogical: urlWithoutLocale,
      i18n,
    },
  } as any;
};

export default onBeforeRoute;
