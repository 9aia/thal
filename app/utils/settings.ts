export function flattenObject<T extends Record<string, any>>(
  obj: T,
): T[keyof T][number][] {
  return Object.values(obj).reduce(
    (acc, val) => acc.concat(val),
    [],
  ) as T[keyof T][number][]
}

export function parseInitialValues(selected: string) {
  return selected.split(', ').reduce<Record<string, boolean>>((acc, key) => {
    if (key === '')
      return acc
    acc[key] = true
    return acc
  }, {})
};

export function generateUsername(text: string): string {
  let base = text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^-+|-+$/g, '')

  if (base.length > 15) {
    base = base.substring(0, 15)
  }
  const randomNumbers = Math.floor(1000 + Math.random() * 9000).toString()
  return `${base}_${randomNumbers}`
}

export function generateName(text: string): string {
  const capitalized = text
    .replace(/_/g, ' ')
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')

  return capitalized.length > 20 ? capitalized.substring(0, 20) : capitalized
}
