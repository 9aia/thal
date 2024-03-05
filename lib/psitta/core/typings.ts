export interface Config {
  defaultLocale?: string
  fallbackLocale?: boolean
  locales?: Locale[]
  translations?: RegisteredMessages
  numberDeclensionRules?: Record<Locale, NumberDeclensionRule>
  defaultNumberDeclensionRule: NumberDeclensionRule
  datetimeFormats?: Record<Locale, string>
  defaultDatetimeFormat: string
  numberFormats?: Record<Locale, string>
  defaultNumberFormat: string
}

export interface Register {}

export type AnyMessages = Translations

export type RegisteredMessages = Register extends {
  messages: infer TMessages extends AnyMessages
}
  ? TMessages
  : AnyMessages

export type Locale = string
export type Text = string
export type Phrase = string
export type Message = string

export type LocaleObject = {
  lang: string
  region?: string
}

export type Translation = Record<Locale, Text>
export type Translations = Record<Text, Translation>

export type NumberDeclensionRule = (forms: string[], count: number) => number

export type DateObject = {
  date: Date
} & Intl.DateTimeFormatOptions

export type NumberObject = {
  number: number
} & Intl.NumberFormatOptions

export type Value = string | number | Date | DateObject | NumberObject
export type Values = Record<Placeholder, Value>

export type Placeholder = string

export type InferValues<
  S extends Text,
  // eslint-disable-next-line
  P extends Values = {},
  // @ts-expect-error
  // eslint-disable-next-line
> = S extends `${infer Text}{${infer Var}}${infer Rest}`
  ? InferValues<Rest, P & { [K in Var]: Value }>
  : P

export interface FormatOptions {
  numberDeclensionRule?: NumberDeclensionRule
  datetimeFormat?: string
  numberFormat?: string
}

export type FormatFunction<O> = (
  text: Text,
  values?: Partial<Values>,
  options?: FormatOptions,
) => O

export type FormatContext<T> = {
  prev: T
  part: string
  dynamic?: boolean
  key?: string
  decline: DeclineFunction
}
export type FormatCallback<T> = (c: FormatContext<T>) => T

export type Declension = {
  phrase: string
  form: string | undefined
}
export type DeclineFunction = (value: Value) => string

export type Segment<P extends Values, V> = {
  type: 'text' | 'placeholder'
  key?: keyof P
  part?: string
  values?: Partial<V>
  decline: DeclineFunction
}

export interface InterpolateOptions { datetimeFormat: string, numberFormat: string }

export {}
