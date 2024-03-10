import { PROFILE_ITEMS } from '~/src/base/constants'
import type { ProfileData } from '../server/schema'

export function getUserData (data: ProfileData) {
  let profileData = ''

  PROFILE_ITEMS.forEach((item) => {
    profileData += `${item.label} ${data[item.id]}\n`
  })
  profileData += `Hobbies: ${data.hobbies}`

  return profileData
}
