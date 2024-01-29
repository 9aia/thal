import { PageContext } from "vike/types";
import { DEFAULT_I18N_CONFIG, i18nConfig } from "./config";

function onI18n(pageContext: PageContext) {
  return (
    pageContext.i18n?.locale ||
    i18nConfig.defaultLocale ||
    DEFAULT_I18N_CONFIG.defaultLocale
  );
}

export default onI18n;
