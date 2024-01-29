import { i18nConfig } from "./config";

function extractLocale(pathname: string) {
  const urlPaths = pathname.split("/");
  const firstPath = urlPaths[1];

  let urlWithoutLocale = pathname;
  let locale;

  if (i18nConfig.locales?.includes(firstPath)) {
    locale = firstPath;
    urlWithoutLocale = "/" + urlPaths.slice(2).join("/");
  }

  return { locale, urlWithoutLocale };
}

export default extractLocale;
