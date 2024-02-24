export function formatDate(date: Date, datetimeFormat: string, options?: Intl.DateTimeFormatOptions) {
  return date.toLocaleDateString(datetimeFormat, options)
}
