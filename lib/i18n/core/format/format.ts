import { i18nConfig } from '../config'
import { DEFAULT_I18N_CONFIG, DEFAULT_NUMBER_DECLENSION_RULE, MESSAGE_PATTERN } from '../constants'
import type { FormatCallback, FormatOptions, Value } from '../types'
import { endEscaping, interpolate, startEscaping } from './interpolate'
import { declineForNumber } from './number'

export function format<T>(text: string, values: Partial<Record<string, Value>> = {}, callbackFn: FormatCallback<T>, initialValue: T, options?: FormatOptions) {
  const numberDeclensionRule
    = options?.numberDeclensionRule || DEFAULT_NUMBER_DECLENSION_RULE
  const datetimeFormat
    = options?.datetimeFormat
    || i18nConfig.defaultDatetimeFormat
    || DEFAULT_I18N_CONFIG.defaultDatetimeFormat
  const numberFormat
    = options?.numberFormat
    || i18nConfig.defaultNumberFormat
    || DEFAULT_I18N_CONFIG.defaultNumberFormat

  text = startEscaping(text)

  return (
    text.match(MESSAGE_PATTERN)?.reduce((prev, part) => {
      const isNamed = part.startsWith('{')

      if (!isNamed) {
        part = endEscaping(part)
        return callbackFn({ prev, part })
      }

      const key = part.substring(1, part.indexOf('}'))
      const value = (values as any)[key]

      if (value === undefined) {
        part = endEscaping(part)
        return callbackFn({ prev, part, key })
      }

      const pluralFormMatch = part.match(/\(([^)]+)\)/)

      let declension: ReturnType<typeof declineForNumber> = { text: part }

      if (pluralFormMatch) {
        const forms = pluralFormMatch[1]
        declension = declineForNumber(part, forms, value, numberDeclensionRule)
      }

      const interpolateOptions = { datetimeFormat, numberFormat }
      part = interpolate(declension.text, key, value, interpolateOptions)

      part = endEscaping(part)

      return callbackFn({
        prev,
        part,
        key,
        dynamic: true,
        form: declension.form,
      })
    }, initialValue) || initialValue
  )
}
