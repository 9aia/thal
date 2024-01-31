import { i18nConfig as _translations, getConfig, i18nConfig } from "./config";
import { format } from "./format";
import { ExtractVariables } from "./types";
import useI18n from "./useI18n";

type ValueOf<T> = T[keyof T];

type EveryTranslationOf<D extends string & keyof I18n.MessageSchema> = Extract<
  ValueOf<I18n.MessageSchema[D]>,
  string
>;

function t<T extends string & keyof I18n.MessageSchema>(
  text: T,
  values?: Partial<ExtractVariables<T | EveryTranslationOf<T>>>
) {
  const i18n = useI18n();
  const locale = i18n.value.locale;
  const { defaultPluralRule, defaultLocale, translations } = getConfig();
  const pluralRule = i18nConfig.pluralRules?.[locale] || defaultPluralRule;

  if (locale === defaultLocale) {
    return format(text, values, pluralRule);
  }

  const messages = (translations as any)[text];
  const message = messages?.[locale];

  if (!messages || !message) {
    if (!i18nConfig.fallbackLocale) {
      throw new Error(
        "No translation found for: `" +
          text +
          "`. To use the default locale, you can enable fallback in the i18n config."
      );
    }

    return format(text, values, pluralRule);
  }

  return format(message, values, pluralRule);
}

export default t;
