import type { Key, Value } from '../types'
import { formatDate } from './date'
import { formatNumber } from './number'

export function startEscaping(text: string) {
  return (text = text
    .replaceAll('\\{', '__CURLY_OPEN')
    .replaceAll('\\}', '__CURLY_CLOSE')
    .replaceAll('\\|', '__PIPE')
    .replaceAll('\\(', '__PARENTHESES_OPEN')
    .replaceAll('\\)', '__PARENTHESES_CLOSE'))
}

export function endEscaping(text: string) {
  return (text = text
    .replaceAll('__CURLY_OPEN', '{')
    .replaceAll('__CURLY_CLOSE', '}')
    .replaceAll('__PIPE', '|')
    .replaceAll('__PARENTHESES_OPEN', '(')
    .replaceAll('__PARENTHESES_CLOSE', ')'))
}

interface InterpolateOptions { datetimeFormat: string, numberFormat: string }

export function interpolate(
  text: string,
  key: Key,
  value: Value,
  options: InterpolateOptions,
) {
  let formattedValue: string

  const isDataObject = typeof value === 'object' && 'date' in value
  const isNumberObject = typeof value === 'object' && 'number' in value

  if (value instanceof Date) {
    formattedValue = formatDate(value, options?.datetimeFormat)
  }
  else if (isDataObject) {
    const formatOptions: any = { ...value }
    delete formatOptions.date

    formattedValue = formatDate(
      value.date,
      options?.datetimeFormat,
      formatOptions,
    )
  }
  else if (isNumberObject) {
    const formatOptions: any = { ...value }
    delete formatOptions.number

    formattedValue = formatNumber(
      value.number,
      options?.numberFormat,
      formatOptions,
    )
  }
  else {
    formattedValue = String(value)
  }

  return text.replaceAll(`{${key}}`, formattedValue)
}
