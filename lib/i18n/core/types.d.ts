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

export namespace I18n {
  export interface MessageSchema {}
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

export type Locale = string
export type Text = string
export type Key = Text

export type Translation = Record<Locale, string>
export type Translations = Record<Key, Translation>

export type NumberDeclensionRule = (forms: string[], count: number) => number

export type DateObject = {
  date: Date
} & Intl.DateTimeFormatOptions

export type NumberObject = {
  number: number
} & Intl.NumberFormatOptions

export type Value = string | number | Date | DateObject | NumberObject
export type Values = Record<string, Value>

export type InferPlaceholders<
  S extends string,
  // eslint-disable-next-line
  Placeholders extends Record<string, string> = {},
> = S extends `${infer Text}{${infer Var}}${infer Rest}`
  ? InferPlaceholders<Rest, Placeholders & { [K in Var]: Value }>
  : Placeholders

export interface FormatOptions {
  numberDeclensionRule?: NumberDeclensionRule
  datetimeFormat?: string
  numberFormat?: string
}

export type FormatFunction<O> = (
  text: Key,
  values?: Partial<Values>,
  options?: FormatOptions,
) => O

export type FormatContext<T> = {
  prev: T
  part: string
  dynamic?: boolean
  form?: string
  key?: string
}
export type FormatCallback<T> = (c: FormatContext<T>) => T

export type Segment<Placeholders, V> = {
  type: 'text' | 'placeholder'
  key?: keyof Placeholders
  part?: string
  form?: string
  values?: Partial<V>
}
