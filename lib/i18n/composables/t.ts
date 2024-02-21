import collect from '../collect'
import { formatToString } from '../format'
import type { ExtractVariables } from '../types'
import { getConfig, getFormatOptions, getMessage } from '../utils'
import useI18n from './useI18n'

type ValueOf<T> = T[keyof T]

type EveryTranslationOf<D extends string & keyof I18n.MessageSchema> = Extract<
  ValueOf<I18n.MessageSchema[D]>,
  string
>

function t<T extends string & keyof I18n.MessageSchema>(
  text: T,
  values?: Partial<ExtractVariables<T | EveryTranslationOf<T>>>,
) {
  if (import.meta.env.DEV)
    collect(text, values)

  const options = getConfig()
  const i18n = useI18n()

  const locale = i18n.value.locale
  const message = getMessage(text, locale, options)
  const formatOptions = getFormatOptions(locale, options)

  return formatToString(message, values, formatOptions)
}

export default t
