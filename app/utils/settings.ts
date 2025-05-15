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

export function generateCharacterName(text: string): string {
  const capitalized = text
    .replace(/_/g, ' ')
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')

  return capitalized.length > 20 ? capitalized.substring(0, 20) : capitalized
}
