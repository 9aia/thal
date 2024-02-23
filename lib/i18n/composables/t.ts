import { usePageContext } from '#lib/vike/composables/usePageContext'
import collect from '../collect'
import { formatToString } from '../format'
import type { ExtractVariables } from '../types'
import { getConfig, getFormatOptions, getMessage } from '../utils'

type ValueOf<T> = T[keyof T]

type EveryTranslationOf<D extends string & keyof I18n.MessageSchema> = Extract<
  ValueOf<I18n.MessageSchema[D]>,
  string
>

function t<T extends string & keyof I18n.MessageSchema>(
  text: T,
  values?: Partial<ExtractVariables<T | EveryTranslationOf<T>>>,
  locale?: string,
) {
  if (import.meta.env.DEV)
    collect(text, values)

  const options = getConfig()

  if (!locale) {
    const c = usePageContext()
    locale = c.i18n.locale
  }

  const message = getMessage(text, locale, options)
  const formatOptions = getFormatOptions(locale, options)

  return formatToString(message, values, formatOptions)
}

export default t
