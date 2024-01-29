import {
  DEFAULT_I18N_CONFIG,
  i18nConfig as _translations,
  i18nConfig,
} from "./config";
import { ExtractVariables } from "./types";
import useI18n from "./useI18n";

const replace = (text: string, _values: Record<string, string> = {}) => {
  Object.keys(_values).forEach((key) => {
    text = text.replaceAll(`{${key}}`, _values[key]);
  })
  return text;
}

function t(text: keyof I18n.MessageSchema, values?: ExtractVariables<typeof text>) {
  const translations = _translations.translations || {};
  const defaultLocale =
    i18nConfig.defaultLocale || DEFAULT_I18N_CONFIG.defaultLocale;

  const i18n = useI18n();
  let locale = i18n.locale;

  if (locale === defaultLocale) {
    return replace(text, values);
  }

  const translation = (translations as any)[text];

  if (!translation) {
    if (!i18nConfig.fallbackLocale) {
      throw new Error(
        "No translation found for: `" +
          text +
          "`. To use the default locale, you can enable fallback in the i18n config."
      );
    }

    return replace(text, values);
  }

  return replace(translation[locale], values);
}

export default t;
