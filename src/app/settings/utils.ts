export function flattenObject<T extends Record<string, any>>(
  obj: T
): T[keyof T][number][] {
  return Object.values(obj).reduce(
    (acc, val) => acc.concat(val),
    []
  ) as T[keyof T][number][];
}