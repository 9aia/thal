import type { InterpolateOptions, Placeholder, Text, Value } from '../index'
import { formatDate, formatNumber } from './formatValues'

function interpolate(
  text: Text,
  placeholder: Placeholder,
  value: Value,
  options: InterpolateOptions,
): Text {
  let formattedValue: Text

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

  return text.replaceAll(`{${placeholder}}`, formattedValue)
}

export default interpolate
