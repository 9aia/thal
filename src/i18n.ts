import { i18nConfig } from "#framework/i18n";
// @ts-ignore
import locales from "../locales/index.ts";

i18nConfig.locales = ["en", "pt"];
i18nConfig.translations = locales;

declare global {
  namespace I18n {
    type MessageSchema = typeof locales;
  }
}
