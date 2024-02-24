import formatToString from '#lib/i18n/core/format/formatToString'
import { getFormatOptions } from '#lib/i18n/core/localization/format'
import localizeKey from '#lib/i18n/core/localization/localizeKey'
import collect from '#lib/i18n/core/translation/collect'
import type { InferValues, Key, Locale, Values } from '#lib/i18n/core/types'
import { getConfig } from '#lib/i18n/core/utils'
import useLocale from './useLocale'

type ValueOf<T> = T[keyof T]

type EveryTranslationOf<D extends string & keyof I18n.MessageSchema> = Extract<
  ValueOf<I18n.MessageSchema[D]>,
  string
>

function t<T extends Key & keyof I18n.MessageSchema>(
  key: T,
  values?: Partial<InferValues<T | EveryTranslationOf<T>>>,
  locale?: Locale,
) {
  if (import.meta.env.DEV)
    collect(key, values as Values)

  const options = getConfig()

  if (!locale)
    locale = useLocale().value

  const message = localizeKey(key, locale, options)
  const formatOptions = getFormatOptions(locale, options)

  return formatToString(message, values, formatOptions)
}

export default t
