import type { User } from "lucia"
import { now } from "~/src/base/utils/date"

export function hasPlanExpired(user: User) {
  if (!user.plan || !user.plan_expires)
    return true

  const date = now()
  const expirationDate = new Date(user.plan_expires)

  return date > expirationDate
}
