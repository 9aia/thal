import { PROFILE_ITEMS } from './constants'
import type { Profile } from './schemas/profile'

export function getProfileData(data: Profile) {
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
