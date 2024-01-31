import { DEFAULT_NUMBER_DECLENSION_RULE } from "./format";
import { I18nConfig } from "./types.d";

export const DEFAULT_I18N_CONFIG = {
  locales: ["en"],
  defaultLocale: "en",
  fallbackLocale: true,
  defaultNumberDeclensionRule: DEFAULT_NUMBER_DECLENSION_RULE,
} satisfies I18nConfig;

export const i18nConfig: I18nConfig = {
  ...DEFAULT_I18N_CONFIG,
};
