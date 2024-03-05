import { DEFAULT_I18N_CONFIG, MESSAGE_PATTERN } from '../constants'
import { type FormatCallback, type FormatOptions, type Text, type Value, type Values, getConfig } from '../index'
import { decline } from './decline'
import interpolate from './interpolate'

function startEscaping(text: Text) {
  return (text = text
    .replaceAll('\\{', '__CURLY_OPEN')
    .replaceAll('\\}', '__CURLY_CLOSE')
    .replaceAll('\\|', '__PIPE')
    .replaceAll('\\(', '__PARENTHESES_OPEN')
    .replaceAll('\\)', '__PARENTHESES_CLOSE'))
}

function endEscaping(text: Text) {
  return (text = text
    .replaceAll('__CURLY_OPEN', '{')
    .replaceAll('__CURLY_CLOSE', '}')
    .replaceAll('__PIPE', '|')
    .replaceAll('__PARENTHESES_OPEN', '(')
    .replaceAll('__PARENTHESES_CLOSE', ')'))
}

function format<T>(
  text: Text,
  values: Partial<Values> = {},
  callbackFn: FormatCallback<T>,
  initialValue: T,
  options?: FormatOptions,
) {
  const config = getConfig()
  const datetimeFormat
    = options?.datetimeFormat
    || config.defaultDatetimeFormat
    || DEFAULT_I18N_CONFIG.defaultDatetimeFormat
  const numberFormat
    = options?.numberFormat
    || config.defaultNumberFormat
    || DEFAULT_I18N_CONFIG.defaultNumberFormat

  text = startEscaping(text)

  const DUMMY_DECLINE = () => ''

  return (
    text.match(MESSAGE_PATTERN)?.reduce((prev, part) => {
      const isNamed = part.startsWith('{')

      if (!isNamed) {
        part = endEscaping(part)
        return callbackFn({ prev, part, decline: DUMMY_DECLINE })
      }

      const key = part.substring(1, part.indexOf('}'))
      const value = (values as any)[key]

      if (value === undefined) {
        part = endEscaping(part)
        return callbackFn({ prev, part, key, decline: DUMMY_DECLINE })
      }

      const declineOptions = { numberDeclensionRule: options?.numberDeclensionRule }
      const phrase = part
      const declension = decline(phrase, value, declineOptions)

      const interpolateOptions = { datetimeFormat, numberFormat }
      part = interpolate(declension.phrase, key, value, interpolateOptions)

      part = endEscaping(part)

      const declinePhrase = (v: Value) => {
        return decline(phrase, v, declineOptions).form || ''
      }

      return callbackFn({
        prev,
        part,
        key,
        dynamic: true,
        decline: declinePhrase,
      })
    }, initialValue) || initialValue
  )
}

export default format
