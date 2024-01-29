import { i18nConfig } from "./config";

function localizeHref(href?: string, locale?: string) {
  if (i18nConfig.defaultLocale === locale || !href || !locale) {
    return href;
  }

  const protocolRegex = /^(?:[a-z]+:)?\/\//i;

  if (protocolRegex.test(href)) {
    return href;
  }

  const path = href.startsWith("/") ? href.slice(1) : href;

  return `/${locale}/${path}`;
}

export default localizeHref;
