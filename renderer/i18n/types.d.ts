import { DEFAULT_I18N_CONFIG } from "./config";

export type Locale = string;
export type Translation = Record<Locale, string>;
export type Translations = Record<string, Translation>;

export type PluralRuleSchema<T extends Locale> = Record<T[number], PluralRule>;

namespace I18n {
  export type MessageSchema = {};
}

export type I18nConfig = {
  defaultLocale?: string;
  fallbackLocale?: boolean;
  locales?: Locale[];
  translations?: I18n.MessageSchema;
  pluralRules?: Record<Locale, PluralRule>;
  defaultPluralRule: PluralRule;
};

export type I18nGlobal = {
  locale: string;
  urlWithoutLocale: string;
  url: string;
};

export type ILocale = {
  lang: string;
  region?: string;
};

export type ExtractVariables<
  S extends string,
  Vars extends Record<string, string> = {}
> = S extends `${infer Text}{${infer Var}}${infer Rest}`
  ? ExtractVariables<Rest, Vars & { [K in Var]: string | number }>
  : Vars;

export type PluralRule = (plurals: string[], count: number) => number;
