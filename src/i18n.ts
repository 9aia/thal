import { i18nConfig } from "#framework/i18n";
// @ts-ignore
import locales from "../locales/index.js";

i18nConfig.locales = ["en", "pt"];
i18nConfig.translations = locales;
i18nConfig.datetimeFormats = {
  en: "en-US",
  pt: "pt-BR",
}

declare global {
  namespace I18n {
    type MessageSchema = typeof locales;
  }
}
