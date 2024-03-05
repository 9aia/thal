export function formatNumber(
  number: number,
  numberFormat: string,
  options?: Intl.NumberFormatOptions,
) {
  return number.toLocaleString(numberFormat, options)
}

export function formatDate(
  date: Date,
  datetimeFormat: string,
  options?: Intl.DateTimeFormatOptions,
) {
  return date.toLocaleDateString(datetimeFormat, options)
}
