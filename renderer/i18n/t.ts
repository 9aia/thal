import { i18nConfig as _translations, getConfig, i18nConfig } from "./config";
import { format } from "./format";
import { ExtractVariables } from "./types";
import useI18n from "./useI18n";

function t(
  text: keyof I18n.MessageSchema,
  values?: ExtractVariables<typeof text>
) {
  const i18n = useI18n();
  const locale = i18n.locale;
  const { defaultPluralRule, defaultLocale, translations } = getConfig();
  const pluralRule = i18nConfig.pluralRules?.[locale] || defaultPluralRule;

  if (locale === defaultLocale) {
    return format(text, values, pluralRule);
  }

  const translation = translations[text];

  if (!translation) {
    if (!i18nConfig.fallbackLocale) {
      throw new Error(
        "No translation found for: `" +
          text +
          "`. To use the default locale, you can enable fallback in the i18n config."
      );
    }

    return format(text, values, pluralRule);
  }

  return format(translation[locale], values, pluralRule);
}

export default t;
