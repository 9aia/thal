import { redirect } from "vike/abort";
import {
  DEFAULT_I18N_CONFIG,
  I18nGlobal,
  detectLocale,
  detectLocaleClient,
  extractLocale,
  i18nConfig,
} from "./i18n";
import { OnBeforeRouteSync } from "vike/types";

const onBeforeRoute: OnBeforeRouteSync = (
  pageContext
): ReturnType<OnBeforeRouteSync> => {
  const { urlWithoutLocale, locale } = extractLocale(pageContext.urlPathname);

  const defaultLocale =
    i18nConfig.defaultLocale || DEFAULT_I18N_CONFIG.defaultLocale;

  const i18n: I18nGlobal = {
    urlWithoutLocale,
    url: pageContext.urlPathname,
    locale: locale || defaultLocale,
  };

  if (!locale) {
    const acceptLanguage =
      typeof window === undefined
        ? null
        : detectLocaleClient(navigator.language)?.lang;

    const lang = pageContext.acceptLanguage
      ? detectLocale(pageContext.acceptLanguage)?.lang || defaultLocale
      : acceptLanguage || defaultLocale;

    if (lang !== defaultLocale) {
      if (i18n.url === urlWithoutLocale) {
        throw redirect(`/${lang}${urlWithoutLocale}`);
      }
    }
  }

  return {
    pageContext: {
      urlLogical: urlWithoutLocale,
      i18n,
    },
  } as any;
};

export default onBeforeRoute;
