import { DEFAULT_I18N_CONFIG } from "./config";

export type Locale = string;
export type Translation = Record<Locale, string>;
export type Translations = Record<string, Translation>;

namespace I18n {
  export type MessageSchema = {};
}

export type I18nConfig<T = I18n.MessageSchema> = {
  defaultLocale?: string;
  fallbackLocale?: boolean;
  locales?: Locale[];
  translations?: T | I18n.MessageSchema;
  numberDeclensionRules?: Record<Locale, NumberDeclensionRule>;
  defaultNumberDeclensionRule: NumberDeclensionRule;
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

export type NumberDeclensionRule = (forms: string[], count: number) => number;

export type FormatCallback<T> = (options: {
  prev: T;
  part: string;
  dynamic?: boolean;
  form?: string;
  key?: string;
}) => T;
