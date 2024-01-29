import { redirect } from "vike/abort";
import type { GuardAsync } from "vike/types";
import { DEFAULT_I18N_CONFIG, i18nConfig, detectLocale, extractLocale } from "./i18n";

const guard: GuardAsync = async (pageContext): ReturnType<GuardAsync> => {
  const { locale: lang, urlWithoutLocale } = extractLocale(
    pageContext.urlPathname
  );

  if (!lang) {
    const lang = pageContext.acceptLanguage
      ? detectLocale(pageContext.acceptLanguage)?.lang
      : DEFAULT_I18N_CONFIG.defaultLocale;
    const defaultLocale =
      i18nConfig.defaultLocale || DEFAULT_I18N_CONFIG.defaultLocale;

    if (lang === defaultLocale) return;

    if (pageContext.i18n.url === urlWithoutLocale) {
      throw redirect(`/${lang}${urlWithoutLocale}`);
    }
  }
};

export default guard;
