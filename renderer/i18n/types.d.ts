export type Locales = Array<string> | undefined;

namespace I18n {
  export type MessageSchema = {};
}

export type I18nConfig = {
  defaultLocale?: string;
  fallbackLocale?: boolean;
  locales?: Locales;
  translations?: I18n.Translations;
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
  ? ExtractVariables<Rest, Vars & { [K in Var]: string }>
  : Vars;
