export function parseJoin<T extends { id: string }>(keys: string, items: T[]) {
  const array: any = keys.split(', ').reduce<T[]>((prev, interestId) => {
    const item = items.find(item => item.id === interestId)

    if (!item)
      return prev

    return [...prev, item]
  }, [])

  return array as T[]
}
