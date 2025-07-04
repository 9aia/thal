import type { LocationQueryRaw } from 'vue-router'

export function stringifyQuery(query: LocationQueryRaw) {
  return Object.entries(query)
    .map(([key, value]) => {
      if (value === undefined)
        return ''

      if (value === null)
        return `${key}`

      return `${key}=${value}`
    })
    .join('&')
}
