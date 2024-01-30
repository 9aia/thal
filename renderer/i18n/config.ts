import { DEFAULT_PLURAL_RULE } from "./format";
import { I18nConfig } from "./types.d";

export const DEFAULT_I18N_CONFIG = {
  locales: ["en"],
  defaultLocale: "en",
  fallbackLocale: true,
  defaultPluralRule: DEFAULT_PLURAL_RULE,
} satisfies I18nConfig;

export const i18nConfig: I18nConfig = {
  ...DEFAULT_I18N_CONFIG,
};

export const getConfig = () => {
  const defaultLocale =
    i18nConfig.defaultLocale || DEFAULT_I18N_CONFIG.defaultLocale;
  const defaultPluralRule =
    i18nConfig.defaultPluralRule || DEFAULT_I18N_CONFIG.defaultPluralRule;
  const translations = i18nConfig.translations || {};
  const locales = i18nConfig.locales || DEFAULT_I18N_CONFIG.locales;
  const fallbackLocale =
    i18nConfig.fallbackLocale || DEFAULT_I18N_CONFIG.fallbackLocale;

  return {
    translations,
    fallbackLocale,
    locales,
    defaultLocale,
    defaultPluralRule,
  } satisfies I18nConfig;
};
