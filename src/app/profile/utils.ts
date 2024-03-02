import { PROFILE_ITEMS } from './constants'
import type { User } from './schemas/user'

export function getUserData(data: User) {
  let profileData = ''

  PROFILE_ITEMS.forEach((item) => {
    profileData += `${item.label} ${data[item.id]}\n`
  })
  profileData += `Hobbies: ${data.hobbies}`

  return profileData
}

export function parseJoin<T extends { id: string }>(keys: string, items: T[]) {
  const array: any = keys.split(', ').reduce<T[]>((prev, interestId) => {
    const item = items.find(item => item.id === interestId)

    if (!item)
      return prev

    return [...prev, item]
  }, [])

  return array as T[]
}
