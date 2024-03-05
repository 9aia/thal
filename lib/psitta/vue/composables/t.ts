import type { InferValues, Locale, RegisteredMessages, Values } from '../../core'
import { collect, formatToString, getConfig, getFormatOptions, localizeKey } from '../../core'
import { isServer } from '../utils'
import useLocale from './useLocale'

type ValueOf<T> = T[keyof T]

type EveryTranslationOf<D extends keyof RegisteredMessages> = Extract<
  ValueOf<RegisteredMessages[D]>,
  string
>

function t<T extends keyof RegisteredMessages>(
  key: T,
  values?: Partial<InferValues<T | EveryTranslationOf<T>>>,
  locale?: Locale,
) {
  if (import.meta.env.DEV) {
    if (!isServer)
      collect(key, values as Values)
  }

  const options = getConfig()

  if (!locale)
    locale = useLocale().value

  const message = localizeKey(key, locale, options)
  const formatOptions = getFormatOptions(locale, options)

  return formatToString(message, values, formatOptions)
}

export default t
