import { inject } from 'vue'
import collect from '../../collect'
import type { InferPlaceholders, Key } from '../../core/types'
import { getConfig, getFormatOptions } from '../../core/utils'
import formatToString from '../../core/format/formatToString'
import { getMessage } from '../../utils'

type ValueOf<T> = T[keyof T]

type EveryTranslationOf<D extends string & keyof I18n.MessageSchema> = Extract<
  ValueOf<I18n.MessageSchema[D]>,
  string
>

function t<T extends Key & keyof I18n.MessageSchema>(
  text: T,
  values?: Partial<InferPlaceholders<T | EveryTranslationOf<T>>>,
  locale?: string,
) {
  if (import.meta.env.DEV)
    collect(text, values)

  const options = getConfig()

  if (!locale)
    locale = inject<string>('__locale')!

  const message = getMessage(text, locale, options)
  const formatOptions = getFormatOptions(locale, options)

  return formatToString(message, values, formatOptions)
}

export default t
