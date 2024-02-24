import { extend } from 'lodash-es'
import type { Ref } from 'vue'

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
  export interface MessageSchema extends Translations {}
}

export type Locale = string
export type Text = string
export type Phrase = string
export type Key = Text
export type Message = string

export type LocaleObject = {
  lang: string
  region?: string
}

export type Translation = Record<Locale, Text>
export type Translations = Record<Key, Translation>

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

export type Segment<P extends Placeholders, V> = {
  type: 'text' | 'placeholder'
  key?: keyof P
  part?: string
  values?: Partial<V>
  decline: DeclineFunction
}

export interface InterpolateOptions { datetimeFormat: string, numberFormat: string }
