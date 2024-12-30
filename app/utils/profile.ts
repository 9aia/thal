import type { ProfileData } from "../schemas/profile"
import { PROFILE_ITEMS } from "~~/app/constants/base"

export function getUserData(data: ProfileData) {
  let profileData = ""

  PROFILE_ITEMS.forEach((item) => {
    profileData += `${item.label} ${data[item.id]}\n`
  })
  profileData += `Hobbies: ${data.hobbies}`

  return profileData
}
