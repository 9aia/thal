export type Locale = string
export type Translation = Record<Locale, string>
export type Translations = Record<string, Translation>

export namespace I18n {
  export interface MessageSchema {}
}

export interface I18nConfig<T = I18n.MessageSchema> {
  defaultLocale?: string
  fallbackLocale?: boolean
  locales?: Locale[]
  translations?: T | I18n.MessageSchema
  numberDeclensionRules?: Record<Locale, NumberDeclensionRule>
  defaultNumberDeclensionRule: NumberDeclensionRule
  datetimeFormats?: Record<Locale, string>
  defaultDatetimeFormat: string
  numberFormats?: Record<Locale, string>
  defaultNumberFormat: string
}

export interface I18nGlobal {
  locale: string
  urlWithoutLocale: string
  url: string
}

export interface ILocale {
  lang: string
  region?: string
}

export type VarValue = string | number | Date | DateObject | NumberObject

export type ExtractVariables<
  S extends string,
  // eslint-disable-next-line
  Vars extends Record<string, string> = {},
> = S extends `${infer Text}{${infer Var}}${infer Rest}`
  ? ExtractVariables<Rest, Vars & { [K in Var]: VarValue }>
  : Vars

export type NumberDeclensionRule = (forms: string[], count: number) => number

export type FormatCallback<T> = (options: {
  prev: T
  part: string
  dynamic?: boolean
  form?: string
  key?: string
}) => T

export type DateObject = {
  date: Date
} & Intl.DateTimeFormatOptions

export type NumberObject = {
  number: number
} & Intl.NumberFormatOptions

export type Segment<T, V> = {
  type: 'text' | 'placeholder'
  key?: keyof T
  part?: string
  form?: string
  values?: Partial<V>
}
